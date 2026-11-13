'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/button';
import { trackEvent } from '@/utils/analytics';

export default function BadgeCreator() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(1200);
  const [canvasHeight, setCanvasHeight] = useState(627);
  const [profileImage, setProfileImage] = useState<string | null>('/placeholder-avatar.png');
  const [profileImageName, setProfileImageName] = useState('');
  const [name, setName] = useState('Your name and title');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle resizing and dragging of avatar image
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });
  const [imageScale, setImageScale] = useState(1);

  const isDragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });
  const lastDistance = useRef<number | null>(null);

  const getTouchDistance = (e: TouchEvent | React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length < 2) return null;
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const preventDefaultTouch = (e: TouchEvent) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    const preventGesture = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };

    document.addEventListener("gesturestart", preventGesture as EventListener, { passive: false });
    document.addEventListener("gesturechange", preventGesture as EventListener, { passive: false });
    document.addEventListener("touchmove", preventGesture as EventListener, { passive: false });

    return () => {
      document.removeEventListener("gesturestart", preventGesture as EventListener);
      document.removeEventListener("gesturechange", preventGesture as EventListener);
      document.removeEventListener("touchmove", preventGesture as EventListener);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const opts = { passive: false } as EventListenerOptions;
    canvas.addEventListener('touchstart', preventDefaultTouch, opts);
    canvas.addEventListener('touchmove', preventDefaultTouch, opts);

    return () => {
      canvas.removeEventListener('touchstart', preventDefaultTouch);
      canvas.removeEventListener('touchmove', preventDefaultTouch);
    };
  }, []);

  const startDragging = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    if ('touches' in e) {
      lastPosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      lastDistance.current = getTouchDistance(e);
    } else {
      lastPosition.current = { x: e.clientX, y: e.clientY };
    }
  };

  const stopDragging = () => {
    isDragging.current = false;
    lastDistance.current = null;
  };

  const onDrag = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;

    if ('touches' in e) {
      if (e.touches.length === 2) {
        const currentDistance = getTouchDistance(e);
        if (lastDistance.current !== null && currentDistance !== null) {
          const delta = currentDistance - lastDistance.current;
          setImageScale((prev) => Math.max(0.1, prev + delta * 0.005));
        }
        lastDistance.current = currentDistance;
        return;
      }
      const point = e.touches[0];
      const deltaX = point.clientX - lastPosition.current.x;
      const deltaY = point.clientY - lastPosition.current.y;
      setImageOffset((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
      lastPosition.current = { x: point.clientX, y: point.clientY };
    } else {
      const deltaX = e.clientX - lastPosition.current.x;
      const deltaY = e.clientY - lastPosition.current.y;
      setImageOffset((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
      lastPosition.current = { x: e.clientX, y: e.clientY };
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const wheelHandler = (e: WheelEvent) => {
      if (e.cancelable) e.preventDefault();
    };

    canvas.addEventListener('wheel', wheelHandler, { passive: false });

    return () => {
      canvas.removeEventListener('wheel', wheelHandler);
    };
  }, []);

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const scaleAmount = e.deltaY < 0 ? 0.05 : -0.05;
    setImageScale((prev) => Math.max(0.1, prev + scaleAmount));
  };

  const handleResize = () => {
    const screenWidth = window.innerWidth;
    const maxWidth = 1200;
    const aspectRatio = 1200 / 627;

    if (screenWidth < maxWidth) {
      setCanvasWidth(Math.max(300, screenWidth - 32));
      setCanvasHeight(Math.max(157, (screenWidth - 32) / aspectRatio));
    } else {
      setCanvasWidth(maxWidth);
      setCanvasHeight(maxWidth / aspectRatio);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        setImageOffset({ x: 0, y: 0 });
        setImageScale(1);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetImagePosition = () => {
    setImageOffset({ x: 0, y: 0 });
    setImageScale(1);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = 1200 * dpr;
    canvas.height = 627 * dpr;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, 1200, 627);

    const background = new Image();
    background.src = '/AONL2027_Template_LinkedIn_Speaking.png';
    background.onload = () => {
      ctx.drawImage(background, 0, 0, 1200, 627);

      if (profileImage) {
        const profile = new Image();
        profile.src = profileImage;
        profile.onload = () => {
          const circleX = 950;
          const circleY = 300;
          const radius = 190;

          const imgRatio = profile.width / profile.height;
          const boxSize = radius * 2;
          let drawW = boxSize;
          let drawH = boxSize;

          if (imgRatio > 1) {
            drawH = boxSize;
            drawW = boxSize * imgRatio;
          } else {
            drawW = boxSize;
            drawH = boxSize / imgRatio;
          }

          const dx = circleX - drawW / 2 + imageOffset.x;
          const dy = circleY - drawH / 2 + imageOffset.y;

          ctx.save();
          ctx.beginPath();
          ctx.arc(circleX, circleY, radius, 0, Math.PI * 2, true);
          ctx.clip();

          ctx.drawImage(
            profile,
            0, 0, profile.width, profile.height,
            dx, dy, drawW * imageScale, drawH * imageScale
          );

          ctx.restore();

          // Render name and title with crisp Inter font
          const fontSize = 34; // Tamaño de la fuente (puedes aumentarlo ej. a 36 o 38)
          const lineHeight = 40; // Espaciado entre líneas
          ctx.font = `600 ${fontSize}px "Inter", Arial, sans-serif`;
          ctx.fillStyle = '#ffffff';

          const maxWidth = 380; // Ancho máximo acorde al círculo (diámetro 380px)
          const lines = [];
          let currentLine = '';
          const words = name.split(' ');

          for (const word of words) {
            const testLine = currentLine + word + ' ';
            const { width } = ctx.measureText(testLine);
            if (width > maxWidth && currentLine !== '') {
              lines.push(currentLine);
              currentLine = word + ' ';
            } else {
              currentLine = testLine;
            }
          }
          lines.push(currentLine);

          ctx.textAlign = 'center';
          const centerX = 950;
          const startY = 530; // Posición vertical inicial
          lines.forEach((line, i) => {
            ctx.fillText(line.trim(), centerX, startY + i * lineHeight);
          });
        };
      }
    };
  };

  useEffect(() => {
    drawCanvas();
  }, [canvasWidth, canvasHeight, profileImage, name, imageOffset, imageScale]);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'AONL2027_Speaking_Badge.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#eef2f6] text-gray-900 pb-12">
      {/* Top Header & Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#661c33] hover:text-[#403033] transition-colors mb-4 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span>Back to Templates</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#661c33]" />
              <span className="text-xs font-semibold tracking-wider uppercase text-[#661c33] bg-[#661c33]/10 px-2.5 py-0.5 rounded-full">
                Speaking Template
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-[#661c33] tracking-tight">
              Customize Your Speaking Badge
            </h1>
            <p className="text-sm text-gray-500 font-sans mt-1">
              Upload your headshot, reposition or zoom, and add your name to highlight your presentation at AONL 2027.
            </p>
          </div>

          <Button
            variant="burgundy"
            onClick={() => {
              downloadImage();
              trackEvent('download_image', { name, template: 'speaking' });
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 shadow-md text-base"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Badge
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 flex flex-col items-center gap-6">
        {/* Controls Card */}
        <div className="w-full max-w-4xl bg-white rounded-2xl border border-gray-200/80 shadow-sm p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            {/* Photo Upload */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
                1. Your Photo
              </label>
              <div className="flex items-center gap-2">
                <Button
                  variant="burgundy"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="whitespace-nowrap text-sm px-4 py-2.5"
                >
                  Upload Photo
                </Button>
                <div className="flex-1 min-w-0 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-gray-50 truncate">
                  {profileImageName || 'No photo selected (using avatar)'}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                  className="hidden"
                />
              </div>
            </div>

            {/* Name & Title Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
                2. Name and Title
              </label>
              <input
                type="text"
                placeholder="E.g., Jane Doe, DNP, RN, FAAN"
                className="w-full border border-gray-300 focus:border-[#661c33] focus:ring-2 focus:ring-[#661c33]/20 rounded-lg px-3.5 py-2 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={(e) => e.target.select()}
              />
            </div>
          </div>

          {/* Interactive Hint */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="text-base">💡</span>
              <span><strong>Tip:</strong> Drag the photo directly on the badge to center it. Scroll or pinch to zoom.</span>
            </span>
            <button
              type="button"
              onClick={resetImagePosition}
              className="text-[#661c33] hover:underline font-medium cursor-pointer"
            >
              Reset photo position
            </button>
          </div>
        </div>

        {/* Canvas Preview Container */}
        <div className="relative border-2 border-gray-200/80 bg-white rounded-2xl overflow-hidden shadow-lg p-2 sm:p-4">
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className="rounded-xl block"
            style={{ width: canvasWidth, height: canvasHeight, cursor: 'grab' }}
            onMouseDown={startDragging}
            onMouseMove={onDrag}
            onMouseUp={stopDragging}
            onMouseLeave={stopDragging}
            onWheel={handleWheel}
          />
        </div>

        {/* Secondary Download Button on bottom for mobile */}
        <div className="flex justify-center w-full max-w-4xl pb-6">
          <Button
            variant="burgundy"
            onClick={() => {
              downloadImage();
              trackEvent('download_image', { name, template: 'speaking' });
            }}
            className="w-full sm:w-auto px-10 py-3.5 text-base shadow-lg flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Badge (PNG)
          </Button>
        </div>
      </div>
    </div>
  );
}
