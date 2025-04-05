/**
 * Extract pure Python code from a string that might contain markdown code blocks.
 * 
 * @param text - The input string containing Python code, possibly within code blocks
 * @returns The extracted Python code without markdown formatting
 */
export function extractPythonCode(text: string): string {
    if (text.includes('```python') && text.includes('```', text.indexOf('```python') + 8)) {
        const startPos = text.indexOf('```python') + '```python'.length;
        let cleanStartPos = startPos;
        if (text.charAt(cleanStartPos) === '\n' || text.charAt(cleanStartPos) === '\r') {
            cleanStartPos++;
            if (text.charAt(startPos) === '\r' && text.charAt(cleanStartPos) === '\n') {
                cleanStartPos++;
            }
        }
        const endPos = text.indexOf('```', cleanStartPos);
        const code = text.substring(cleanStartPos, endPos).trim();
        return code;
    }
    return text.trim();
}