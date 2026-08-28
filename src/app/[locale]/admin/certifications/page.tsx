"use client";

import { useState, useRef, useEffect } from "react";
import { Download, Upload, Type, Image as ImageIcon, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const CERTIFICATES = [
  { id: "corporate", name: "Corporate Membership", file: "/certificates/Corporate Membership  Certificate1.png" },
  { id: "family", name: "Family Membership", file: "/certificates/Family Membership Certificate.png" },
  { id: "family-id", name: "Family ID Inside", file: "/certificates/Membership Family ID inside 10 x 15 cm.png" },
  { id: "regular-front-back", name: "Regular ID Front & Back", file: "/certificates/Membership Regular ID Front & Back 10 x 15 cm.png" },
  { id: "regular-inside", name: "Regular ID Inside", file: "/certificates/Membership Regular ID inside 10 x 15 cm.png" }
];

interface Label {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  isExpanded: boolean;
}

export default function CertificationsPage() {
  const [selectedCert, setSelectedCert] = useState(CERTIFICATES[0]);
  const [labels, setLabels] = useState<Label[]>([
    { id: "1", text: "John Doe", x: 50, y: 50, fontSize: 48, color: "#000000", isExpanded: true }
  ]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = selectedCert.file;
    img.onload = () => {
      imageRef.current = img;
      drawCanvas();
    };
  }, [selectedCert]);

  useEffect(() => {
    drawCanvas();
  }, [labels, selectedCert]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = imageRef.current.width;
    canvas.height = imageRef.current.height;
    ctx.drawImage(imageRef.current, 0, 0);

    labels.forEach(label => {
      ctx.font = `bold ${label.fontSize}px Arial`;
      ctx.fillStyle = label.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const xPos = (canvas.width * label.x) / 100;
      const yPos = (canvas.height * label.y) / 100;

      ctx.fillText(label.text, xPos, yPos);
    });
  };

  const addLabel = () => {
    const newLabel: Label = {
      id: Date.now().toString(),
      text: "New Label",
      x: 50,
      y: 60,
      fontSize: 40,
      color: "#000000",
      isExpanded: true
    };
    setLabels([...labels.map(l => ({ ...l, isExpanded: false })), newLabel]);
  };

  const updateLabel = (id: string, updates: Partial<Label>) => {
    setLabels(labels.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const removeLabel = (id: string) => {
    if (labels.length > 1) {
      setLabels(labels.filter(l => l.id !== id));
    }
  };

  const toggleExpand = (id: string) => {
    setLabels(labels.map(l => l.id === id ? { ...l, isExpanded: !l.isExpanded } : l));
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `Certificate_${selectedCert.name}.png`;
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
        <div className="space-y-6 h-fit overflow-y-auto max-h-[85vh] pr-2 custom-scrollbar">
          {/* Template Selector */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
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

          {/* Member Details Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">Member Details</label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={addLabel}
                className="h-8 px-2 text-[#ED1C24] hover:bg-red-50 flex items-center gap-1 font-bold text-[10px]"
              >
                <Plus className="h-3 w-3" /> Add Label
              </Button>
            </div>

            <div className="space-y-4">
              {labels.map((label, index) => (
                <div key={label.id} className="border border-gray-100 rounded-xl overflow-hidden">
                  <div 
                    onClick={() => toggleExpand(label.id)}
                    className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-xs font-bold text-gray-700 truncate max-w-[150px]">
                      {label.text || "Empty Label"}
                    </span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeLabel(label.id); }}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        disabled={labels.length === 1}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                      {label.isExpanded ? <ChevronUp className="h-3 w-3 text-gray-400" /> : <ChevronDown className="h-3 w-3 text-gray-400" />}
                    </div>
                  </div>

                  {label.isExpanded && (
                    <div className="p-4 space-y-4 bg-white border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400">Label</label>
                        <input
                          type="text"
                          value={label.text}
                          onChange={(e) => updateLabel(label.id, { text: e.target.value })}
                          className="w-full mt-1 p-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ED1C24]/20 text-sm"
                          placeholder="Enter label text..."
                        />
                      </div>

                      <div className="space-y-3 pt-4 border-t border-gray-100">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Positioning</label>
                        
                        <div className="space-y-3 pt-2">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black uppercase text-gray-400">Font Size</label>
                            <span className="text-[10px] font-bold text-[#ED1C24]">{label.fontSize}px</span>
                          </div>
                          <input
                            type="range"
                            min="12"
                            max="200"
                            value={label.fontSize}
                            onChange={(e) => updateLabel(label.id, { fontSize: parseInt(e.target.value) })}
                            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#ED1C24]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <label className="text-[10px] font-black uppercase text-gray-400">Horizontal %</label>
                              <span className="text-[10px] font-bold text-gray-600">{label.x}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={label.x}
                              onChange={(e) => updateLabel(label.id, { x: parseInt(e.target.value) })}
                              className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-gray-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <label className="text-[10px] font-black uppercase text-gray-400">Vertical %</label>
                              <span className="text-[10px] font-bold text-gray-600">{label.y}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={label.y}
                              onChange={(e) => updateLabel(label.id, { y: parseInt(e.target.value) })}
                              className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-gray-400"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-black uppercase text-gray-400">Text Color</label>
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="color"
                              value={label.color}
                              onChange={(e) => updateLabel(label.id, { color: e.target.value })}
                              className="h-8 w-12 p-0.5 rounded border border-gray-200 cursor-pointer"
                            />
                            <span className="text-xs font-mono text-gray-500 uppercase">{label.color}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <Button 
              onClick={handleDownload}
              className="w-full h-12 bg-[#ED1C24] hover:bg-black text-white font-black uppercase tracking-widest text-[10px] rounded-xl flex items-center gap-2 transition-all shadow-md shadow-red-100"
            >
              <Download className="h-4 w-4" /> Download Certificate
            </Button>
          </div>
        </div>

        {/* Canvas Preview Area */}
        <div className="lg:col-span-2 bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden flex flex-col min-h-[600px] shadow-inner">
          <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
             <div className="flex items-center gap-2">
               <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
               <span className="text-xs font-black uppercase tracking-widest text-gray-500">Live Editor Preview</span>
             </div>
             <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">High Precision Render</span>
          </div>
          <div className="flex-1 p-8 overflow-auto flex items-center justify-center bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYNgRwEwwB+IGr88P5gNMWESgH8mGkWwTWRcMhmEwDCZzMHAwMGBYgQAAyIgb0d2H5WAAAAAASUVORK5CYII=')]">
             <div className="relative group">
                <canvas 
                    ref={canvasRef} 
                    className="max-w-full h-auto shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-sm"
                    style={{ maxHeight: '75vh' }}
                />
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#ED1C24]/10 pointer-events-none transition-all duration-300" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
