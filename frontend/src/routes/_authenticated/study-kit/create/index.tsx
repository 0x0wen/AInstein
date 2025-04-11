'use client';

import type React from 'react';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Image, X } from 'lucide-react';
import { createFileRoute } from '@tanstack/react-router';
import { useNavigate } from '@tanstack/react-router';
import api from '@/lib/api';
import Backgrounds from '@/components/custom/Backgrounds';

export const colorOptions = [
  { name: 'Blue', value: { hex: '#1E88E5', rgb: [30, 136, 229] } },
  { name: 'Green', value: { hex: '#7CB342', rgb: [124, 179, 66] } },
  { name: 'Amber', value: { hex: '#FFA000', rgb: [255, 160, 0] } },
  { name: 'Red', value: { hex: '#E53935', rgb: [229, 57, 53] } },
  { name: 'Purple', value: { hex: '#8E24AA', rgb: [142, 36, 170] } },
  { name: 'Teal', value: { hex: '#00897B', rgb: [0, 137, 123] } },
];

export const backgroundOptions = [
'LiquidChrome' ,
'Iridescence' ,
'Balatro',
'Dither',
'Threads',
'LetterGlitch' ,
'Particles',
'Waves',
];

export const Route = createFileRoute('/_authenticated/study-kit/create/')({
  component: CreateKitPage,
});

export default function CreateKitPage() {
  const navigate = useNavigate();
  // const fileInputRef = useRef<HTMLInputElement>(null);
  // const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    background: string;
    // background: string | File;
    colorTheme: string;
    progress: {
      percentage: number;
      lastActivity: Date;
    };
  }>({
    name: '',
    description: '',
    background: '',
    colorTheme:
      colorOptions.find((color) => color.name === 'Blue')?.value.hex ||
      '#1E88E5',
    progress: {
      percentage: 0,
      lastActivity: new Date(),
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   // Create a preview URL for the selected image
  //   const previewUrl = URL.createObjectURL(file);
  //   setImagePreview(previewUrl);

  //   // Update form data with the file
  //   setFormData((prev) => ({
  //     ...prev,
  //     background: file,
  //   }));
  // };

  // const handleRemoveImage = () => {
  //   setImagePreview(null);
  //   setFormData((prev) => ({ ...prev, background: '' }));
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = '';
  //   }
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating study kit:', formData);

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('description', formData.description);
    submitData.append('colorTheme', formData.colorTheme);

    // if (formData.background && typeof formData.background !== 'string') {
    //   submitData.append('background', formData.background);
    // }
    submitData.append('background', formData.background);

    console.log('AHOY', submitData);
    api.post('/studykit', submitData);
    navigate({ to: '/' });
  };

  return (
    <main className="container mx-auto px-4 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Study Kit</h1>
        <p className="text-muted-foreground mt-1">
          Set up a new learning space for your subject or topic
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base">
                  Study Kit Name
                </Label>
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-l-md border border-r-0 border-input">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Calculus Fundamentals"
                    value={formData.name}
                    onChange={handleChange}
                    className="rounded-l-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-base">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Briefly describe what you'll be learning in this Study Kit"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-base">Color Theme</Label>
                <div className="flex flex-wrap gap-3">
                  {colorOptions.map((color) => (
                    <div
                      key={color.value.hex}
                      className={`w-10 h-10 rounded-full cursor-pointer flex items-center justify-center border-2 ${
                        formData.colorTheme === color.value.hex
                          ? 'border-black dark:border-white'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.value.hex }}
                      onClick={() =>
                        {console.log(formData);
                          setFormData((prev) => ({
                          ...prev,
                          colorTheme: color.value.hex,
                        }))}
                      }
                      title={color.name}
                    >
                      {formData.colorTheme === color.value.hex && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base">Background</Label>
                <div className="flex flex-wrap gap-3">
                  {backgroundOptions.map((background) => (
                    <div
                      key={background}
                      className={`w-10 h-10 overflow-hidden rounded-full cursor-pointer relative flex items-center justify-center border-2 ${
                        formData.background === background
                          ? 'border-black dark:border-white'
                          : 'border-transparent'
                      }`}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          background: background,
                        }))
                      }
                      title={background}
                    >
                      <Backgrounds colorTheme={colorOptions.find((color)=>formData.colorTheme == color.value.hex)?.value!} type={background}/>
                      {formData.background === background && (
                        
                        <div className='bg-black/70 w-full h-full absolute  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center'><svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className=' z-50'
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="border-2 border-dashed border-gray-300 h-[200px] overflow-hidden rounded-lg text-center">
                <Backgrounds colorTheme={colorOptions.find((color)=>formData.colorTheme == color.value.hex)?.value!} type={formData.background}/>
                {/* {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview || '/placeholder.svg'}
                        alt="Cover preview"
                        className="mx-auto max-h-48 rounded-md object-contain"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        onClick={handleRemoveImage}
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2">
                        {typeof formData.background === 'object' &&
                        formData.background instanceof File
                          ? formData.background.name
                          : 'Selected image'}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Image className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Drag and drop an image, or click to browse
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="relative"
                      >
                        Choose Image
                        <Input
                          ref={fileInputRef}
                          id="picture"
                          name="background"
                          type="file"
                          accept="image/png, image/jpeg, image/jpg, image/webp"
                          className="absolute w-full h-full opacity-0 cursor-pointer"
                          onChange={handleFileChange}
                        />
                      </Button>
                    </>
                  )} */}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: '/' })}
          >
            Cancel
          </Button>
          <Button type="submit">Create Study Kit</Button>
        </div>
      </form>
    </main>
  );
}
