"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  Camera,
  CheckCircle,
  XCircle,
  UploadCloud,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useUploadThing } from "@/utils/uploadthing";

const UploadStatus = {
  IDLE: "idle",
  PREVIEW: "preview",
  UPLOADING: "uploading",
  SUCCESS: "success",
  ERROR: "error",
} as const;

type UploadStatusType = (typeof UploadStatus)[keyof typeof UploadStatus];

type StatusConfig = {
  [key in UploadStatusType]: {
    icon: React.ReactNode;
    title: string;
    message: string;
  };
};

const statusConfig: StatusConfig = {
  [UploadStatus.IDLE]: {
    icon: <Camera className="h-12 w-12 text-blue-500" />,
    title: "Upload Your Profile Picture",
    message: "Click or drag and drop to upload",
  },
  [UploadStatus.PREVIEW]: {
    icon: <ImageIcon className="h-12 w-12 text-blue-500" />,
    title: "Preview Your Picture",
    message: "Click 'Upload' to confirm or choose another",
  },
  [UploadStatus.UPLOADING]: {
    icon: <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />,
    title: "Uploading Your Picture",
    message: "Please wait...",
  },
  [UploadStatus.SUCCESS]: {
    icon: <CheckCircle className="h-12 w-12 text-green-500" />,
    title: "Upload Successful!",
    message: "Your profile picture has been set",
  },
  [UploadStatus.ERROR]: {
    icon: <XCircle className="h-12 w-12 text-red-500" />,
    title: "Upload Failed",
    message: "Please try again",
  },
};

export default function UploadPictureClient() {
  const [status, setStatus] = useState<UploadStatusType>(UploadStatus.IDLE);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setEmail(localStorage.getItem("email"));
  }, []);

  const { startUpload } = useUploadThing("imageUploader", {
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
    onClientUploadComplete: async (res) => {
      if (res?.[0] && email) {
        try {
          await axios.post("/api/upload-picture", {
            email,
            image: res[0].url,
          });
          setStatus(UploadStatus.SUCCESS);
          toast.success("Upload successful!");
        } catch (error) {
          setStatus(UploadStatus.ERROR);
          toast.error("Failed to update user profile. Please try again.");
        }
      } else {
        setStatus(UploadStatus.ERROR);
        toast.error("User not found. Please log in and try again.");
      }
    },
    onUploadError: () => {
      setStatus(UploadStatus.ERROR);
      toast.error("Upload failed. Please try again.");
    },
  });

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (selectedFile) {
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
          setStatus(UploadStatus.PREVIEW);
        };
        reader.readAsDataURL(selectedFile);
      }
    },
    []
  );

  const handleUpload = useCallback(async () => {
    if (!file || !email) {
      toast.error("User not found or no file selected. Please try again.");
      return;
    }
    setStatus(UploadStatus.UPLOADING);
    setUploadProgress(0);
    try {
      await startUpload([file]);
    } catch (error) {
      setStatus(UploadStatus.ERROR);
      toast.error("Upload failed. Please try again.");
    }
  }, [file, email, startUpload]);

  const currentStatus = statusConfig[status];

  const handleImageClick = useCallback(() => {
    if (status !== UploadStatus.UPLOADING && status !== UploadStatus.SUCCESS) {
      fileInputRef.current?.click();
    }
  }, [status]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setStatus(UploadStatus.PREVIEW);
      };
      reader.readAsDataURL(droppedFile);
    }
  }, []);

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-r from-blue-100 to-purple-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="pt-6 px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div
              className="relative w-48 h-48 rounded-full border-4 border-dashed border-blue-300 flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 hover:border-blue-500"
              onClick={handleImageClick}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Profile preview"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-4">
                  <UploadCloud className="h-12 w-12 text-blue-500 mb-2" />
                  <p className="text-sm text-gray-500">Click or drag image</p>
                </div>
              )}
              {status === UploadStatus.UPLOADING && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="text-white text-lg font-bold">
                    {Math.round(uploadProgress)}%
                  </div>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              disabled={status === UploadStatus.SUCCESS}
            />
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-gray-800">
                {currentStatus.title}
              </h2>
              <p className="text-sm text-gray-600">{currentStatus.message}</p>
            </div>
            {/* {status === UploadStatus.UPLOADING && (
              <div className="w-full space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-gray-600">
                  Uploading... {Math.round(uploadProgress)}%
                </p>
              </div>
            )} */}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center pb-6 px-6 space-y-4">
          {status === UploadStatus.PREVIEW && (
            <Button
              onClick={handleUpload}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300"
            >
              Upload Picture
            </Button>
          )}
          {status === UploadStatus.UPLOADING && (
            <Button
              className="w-full bg-blue-500 text-white cursor-not-allowed opacity-70"
              disabled
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </Button>
          )}
          {status === UploadStatus.SUCCESS && (
            <Button
              onClick={() => router.push("/")}
              className="w-full bg-green-500 hover:bg-green-600 text-white transition-colors duration-300"
            >
              Go to Home
            </Button>
          )}
          {status === UploadStatus.ERROR && (
            <Button
              onClick={() => setStatus(UploadStatus.IDLE)}
              className="w-full bg-red-500 hover:bg-red-600 text-white transition-colors duration-300"
            >
              Try Again
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
