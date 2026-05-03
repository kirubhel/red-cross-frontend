"use client";

import { useState, useRef, useEffect } from "react";
import { Download, Upload, Type, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const CERTIFICATES = [
  { id: "corporate", name: "Corporate Membership", file: "/certificates/Corporate Membership  Certificate1.png" },
  { id: "family", name: "Family Membership", file: "/certificates/Family Membership Certificate.png" },
  { id: "family-id", name: "Family ID Inside", file: "/certificates/Membership Family ID inside 10 x 15 cm.png" },
  { id: "regular-front-back", name: "Regular ID Front & Back", file: "/certificates/Membership Regular ID Front & Back 10 x 15 cm.png" },
  { id: "regular-inside", name: "Regular ID Inside", file: "/certificates/Membership Regular ID inside 10 x 15 cm.png" }
];

export default function CertificationsPage() {
  const [selectedCert, setSelectedCert] = useState(CERTIFICATES[0]);
  const [memberInfo, setMemberInfo] = useState({
    name: "John Doe",
    idNumber: "ERCS-0001",
    date: new Date().toLocaleDateString()
  });
  const [position, setPosition] = useState({ x: 50, y: 50 }); // Percentage based
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState("#000000");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    // Load image
    const img = new Image();
    img.src = selectedCert.file;
    img.onload = () => {
      imageRef.current = img;
      drawCanvas();
    };
  }, [selectedCert]);

  useEffect(() => {
    drawCanvas();
  }, [memberInfo, position, fontSize, color]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions to match image
    canvas.width = imageRef.current.width;
    canvas.height = imageRef.current.height;

    // Draw background
    ctx.drawImage(imageRef.current, 0, 0);

    // Draw text
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const xPos = (canvas.width * position.x) / 100;
    const yPos = (canvas.height * position.y) / 100;

    ctx.fillText(memberInfo.name, xPos, yPos);
    
    // Can draw more fields if needed, simplified to name for dynamic positioning
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${memberInfo.name.replace(/\s+/g, "_")}_${selectedCert.name}.png`;
    link.href = url;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">Certifications</h1>
          <p className="text-sm text-gray-500 font-bold">Generate and download official ERCS certificates</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Editor Controls */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 h-fit">
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Template</label>
            <div className="grid gap-2">
              {CERTIFICATES.map(cert => (
                <button
                  key={cert.id}
                  onClick={() => setSelectedCert(cert)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    selectedCert.id === cert.id 
                      ? "border-[#ED1C24] bg-red-50 text-[#ED1C24]" 
                      : "border-gray-100 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  <ImageIcon className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-bold truncate">{cert.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-100">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Member Details</label>
            <div>
              <label className="text-[10px] font-bold text-gray-500">Full Name</label>
              <input
                type="text"
                value={memberInfo.name}
                onChange={(e) => setMemberInfo({...memberInfo, name: e.target.value})}
                className="w-full mt-1 p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ED1C24]/20"
              />
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-100">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Positioning</label>
            
            <div>
              <label className="text-[10px] font-bold text-gray-500">Font Size ({fontSize}px)</label>
              <input
                type="range"
                min="12"
                max="200"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500">Horizontal %</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={position.x}
                  onChange={(e) => setPosition({...position, x: parseInt(e.target.value)})}
                  className="w-full mt-1"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500">Vertical %</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={position.y}
                  onChange={(e) => setPosition({...position, y: parseInt(e.target.value)})}
                  className="w-full mt-1"
                />
              </div>
            </div>
            
            <div>
              <label className="text-[10px] font-bold text-gray-500">Text Color</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-10 p-1 rounded-xl border border-gray-200 mt-1 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <Button 
              onClick={handleDownload}
              className="w-full h-12 bg-[#ED1C24] hover:bg-black text-white font-black uppercase tracking-widest text-[10px] rounded-xl flex items-center gap-2"
            >
              <Download className="h-4 w-4" /> Download Certificate
            </Button>
          </div>
        </div>

        {/* Canvas Preview Area */}
        <div className="lg:col-span-2 bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden flex flex-col min-h-[600px]">
          <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
             <span className="text-xs font-black uppercase tracking-widest text-gray-500">Live Preview</span>
             <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">High Res Render</span>
          </div>
          <div className="flex-1 p-4 overflow-auto flex items-center justify-center bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYNgRwEwwB+IGr88P5gNMWESgH8mGkWwTWRcMhmEwDCZzMHAwMGBYgQAAyIgb0d2H5WAAAAAASUVORK5CYII=')]">
             <canvas 
                ref={canvasRef} 
                className="max-w-full h-auto shadow-2xl rounded"
                style={{ maxHeight: '70vh' }}
             />
          </div>
        </div>
      </div>
    </div>
  );
}
