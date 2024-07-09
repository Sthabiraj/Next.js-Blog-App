"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, Camera, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

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
    icon?: React.ReactNode;
    title: string;
    message: string;
  };
};

const statusConfig: StatusConfig = {
  [UploadStatus.IDLE]: {
    icon: <Camera className="h-16 w-16 text-blue-500" />,
    title: "Upload Your Profile Picture",
    message: "Click to choose a photo.",
  },
  [UploadStatus.PREVIEW]: {
    title: "Preview Your Picture",
    message: "Click 'Upload' to confirm or click the image to choose another.",
  },
  [UploadStatus.UPLOADING]: {
    icon: <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />,
    title: "Uploading Your Picture",
    message: "Please wait...",
  },
  [UploadStatus.SUCCESS]: {
    icon: <CheckCircle className="h-16 w-16 text-green-500" />,
    title: "Upload Successful!",
    message: "Your profile picture has been set.",
  },
  [UploadStatus.ERROR]: {
    icon: <XCircle className="h-16 w-16 text-red-500" />,
    title: "Upload Failed",
    message: "Please try again.",
  },
};

export default function UploadPictureClient() {
  const [status, setStatus] = useState<UploadStatusType>(UploadStatus.IDLE);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setStatus(UploadStatus.PREVIEW);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!previewUrl) return;

    setStatus(UploadStatus.UPLOADING);
    setProgress(0);

    try {
      // Simulating upload process
      await new Promise<void>((resolve, reject) => {
        const intervalId = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(intervalId);
              resolve();
              return 100;
            }
            return prev + 10;
          });
        }, 500);

        // Simulate potential upload failure
        setTimeout(() => {
          if (Math.random() > 0.8) {
            clearInterval(intervalId);
            reject(new Error("Upload failed"));
          }
        }, 5000);
      });

      setStatus(UploadStatus.SUCCESS);
      toast.success("Upload successful!");
    } catch (error) {
      setStatus(UploadStatus.ERROR);
      toast.error("Upload failed. Please try again.");
    }
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-r from-blue-100 to-purple-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="pt-8 px-8">
          <div className="flex flex-col items-center text-center space-y-6">
            <div
              className="relative w-48 h-48 cursor-pointer"
              onClick={() =>
                status !== UploadStatus.UPLOADING &&
                fileInputRef.current?.click()
              }
            >
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Profile preview"
                  width={192}
                  height={192}
                  className="object-cover rounded-full border-4 border-blue-500"
                />
              ) : (
                <div className="w-full h-48 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
                  {currentStatus.icon}
                </div>
              )}
              {status === UploadStatus.UPLOADING && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <h2 className="text-2xl font-bold text-gray-800">
              {currentStatus.title}
            </h2>
            <p className="text-gray-600">{currentStatus.message}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center pb-8 px-8 space-y-4">
          {status === UploadStatus.PREVIEW && (
            <Button
              onClick={handleUpload}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              Upload Picture
            </Button>
          )}
          {status === UploadStatus.UPLOADING && (
            <div className="w-full space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-center text-sm text-gray-600">
                Uploading... {progress}%
              </p>
            </div>
          )}
          {status === UploadStatus.SUCCESS && (
            <Button
              onClick={() => router.push("/")}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              Go to Home
            </Button>
          )}
          {status === UploadStatus.ERROR && (
            <Button
              onClick={() => setStatus(UploadStatus.IDLE)}
              className="w-full bg-red-500 hover:bg-red-600 text-white"
            >
              Try Again
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
