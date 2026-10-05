'use client';

import { useState, useRef, useEffect } from 'react';

export default function ImageBlurTool({ imageSrc, onComplete, onCancel }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const maxWidth = 800;
      const scale = Math.min(maxWidth / img.width, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      setCtx(context);
      setHistory([canvas.toDataURL()]);
    };
  }, [imageSrc]);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL();
    setHistory(prev => [...prev, dataUrl]);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const newHistory = [...history];
    newHistory.pop();
    const previousState = newHistory[newHistory.length - 1];
    const img = new Image();
    img.src = previousState;
    img.onload = () => {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(img, 0, 0);
      setHistory(newHistory);
    };
  };

  const startDrawing = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineWidth = 30;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.filter = 'blur(10px)';
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.filter = 'none';
  };

  const stopDrawing = () => {
    if (isDrawing) {
      ctx.closePath();
      setIsDrawing(false);
      saveToHistory();
    }
  };

  const handleSave = () => {
    const blurredImage = canvasRef.current.toDataURL('image/jpeg', 0.9);
    onComplete(blurredImage);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-[56px] overflow-hidden shadow-2xl max-w-4xl w-full flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-700">
        <div className="p-8 md:p-12 border-b border-slate-50 flex items-center justify-between">
          <div className="text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Privacy Redaction</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Blur sensitive details for ecosystem safety</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleUndo} 
              disabled={history.length <= 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${history.length <= 1 ? 'text-slate-200 cursor-not-allowed' : 'text-primary-700 bg-primary-50 hover:bg-primary-100'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
              Undo
            </button>
            <button onClick={onCancel} className="h-14 w-14 rounded-full bg-[#F9FAF9] flex items-center justify-center text-slate-400 hover:text-red-500 transition-all border border-slate-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-10 flex items-center justify-center bg-[#F9FAF9]">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="rounded-[32px] shadow-2xl cursor-crosshair bg-white border border-white"
          />
        </div>

        <div className="p-10 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4 text-slate-400">
            <div className="h-10 w-10 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest max-w-[240px] text-left">Draw over faces, serial numbers, or addresses to anonymize evidence.</p>
          </div>
          <button onClick={handleSave} className="px-12 py-5 bg-primary-700 text-white rounded-full font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-primary-900/20 hover:bg-primary-800 active:scale-95 transition-all flex items-center gap-3">
              Authorize Image Protocol
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
