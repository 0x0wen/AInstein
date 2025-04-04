import os
import json
import uuid
import boto3
import tempfile
import subprocess
from pathlib import Path

# Initialize clients
s3 = boto3.client('s3')

# S3 bucket for storing videos
BUCKET_NAME = os.environ.get('S3_BUCKET_NAME', 'ainstein-prod')

def lambda_handler(event, context):
    """AWS Lambda handler."""
    try:
        # Extract user prompt from event or use pre-generated code
        body = json.loads(event.get('body', '{}'))
        
        # Check if code is provided directly (from your backend)
        if 'code' in body:
            manim_code = body['code']
        else:
            # This branch would be used if you're generating code in Lambda
            # But based on your previous decision, this likely won't be used
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'No code provided'})
            }
        
        # Generate a unique ID for this video
        video_id = str(uuid.uuid4())
        
        # Create temp directory
        with tempfile.TemporaryDirectory() as tmpdir:
            # Write code to file
            code_file = Path(tmpdir) / "scene.py"
            with open(code_file, "w") as f:
                f.write(manim_code)
            
            # Extract scene class name
            import re
            scene_match = re.search(r'class\s+(\w+)\s*\(\s*Scene\s*\)', manim_code)
            if not scene_match:
                raise Exception("Could not find Scene class in code")
            
            scene_class = scene_match.group(1)
            
            # Execute Manim
            # Note: Commands may need adjustment based on the Manim Docker image
            cmd = [
                "manim", 
                str(code_file),
                scene_class,
                "-ql",  # Low quality for faster rendering
                "--media_dir", tmpdir,
                "--log_to_file",  # Add logging to file for better debugging
            ]

            
            process = subprocess.run(cmd, capture_output=True, text=True)
            if process.returncode != 0:
                # Search for log files to provide more context
                log_files = list(Path(tmpdir).glob("**/logs/*.log"))
                log_content = ""
                for log_file in log_files:
                    try:
                        with open(log_file, 'r') as f:
                            log_content += f.read()
                    except:
                        pass
                raise Exception(f"Manim execution failed: {process.stderr}\nLog files: {log_content}")
            if process.returncode != 0:
                raise Exception(f"Manim execution failed: {process.stderr}")
            
            media_dir = Path(tmpdir) / "media"
            video_files = []

            # Search recursively for MP4 files
            for mp4_file in Path(tmpdir).glob("**/*.mp4"):
                video_files.append(mp4_file)
                print(f"Found video file: {mp4_file}")
                
            if not video_files:
                # Debug: List all files to see what was actually generated
                all_files = list(Path(tmpdir).glob("**/*"))
                raise Exception(f"No video file was generated. Found files: {all_files}")
            
            # Upload to S3
            output_key = f"{video_id}.mp4"
            s3.upload_file(
                str(video_files[0]), 
                BUCKET_NAME, 
                output_key,
                ExtraArgs={'ContentType': 'video/mp4', 'ACL': 'public-read'}
            )
            
            # Generate video URL
            video_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{output_key}"
            
            # Return success response
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'success': True,
                    'video_url': video_url
                }),
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
    
    except Exception as e:
        # Return error response
        return {
            'statusCode': 500,
            'body': json.dumps({
                'success': False,
                'error': str(e)
            }),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }