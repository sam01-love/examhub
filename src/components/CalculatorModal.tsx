import React, { useState } from 'react';
import { X, Delete, Calculator } from 'lucide-react';

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalculatorModal: React.FC<CalculatorModalProps> = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('0');

  if (!isOpen) return null;

  const handleBtn = (val: string) => {
    if (val === 'C') {
      setDisplay('0');
      return;
    }
    if (val === 'DEL') {
      setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
      return;
    }
    if (val === '=') {
      try {
        // Sanitize & evaluate simple arithmetic expression safely
        const sanitized = display.replace(/×/g, '*').replace(/÷/g, '/');
        const res = Function(`"use strict"; return (${sanitized})`)();
        setDisplay(String(res));
      } catch {
        setDisplay('Error');
      }
      return;
    }

    setDisplay((prev) => {
      if (prev === '0' || prev === 'Error') {
        return val;
      }
      return prev + val;
    });
  };

  const buttons = [
    ['C', 'DEL', '(', ')', '÷'],
    ['7', '8', '9', '×', 'sin'],
    ['4', '5', '6', '-', 'cos'],
    ['1', '2', '3', '+', 'tan'],
    ['0', '.', '^', '√', '='],
  ];

  const handleSpecialFunc = (func: string) => {
    try {
      const num = parseFloat(display);
      if (isNaN(num)) return;
      if (func === 'sin') setDisplay(String(Math.sin((num * Math.PI) / 180).toFixed(4)));
      if (func === 'cos') setDisplay(String(Math.cos((num * Math.PI) / 180).toFixed(4)));
      if (func === 'tan') setDisplay(String(Math.tan((num * Math.PI) / 180).toFixed(4)));
      if (func === '√') setDisplay(String(Math.sqrt(num).toFixed(4)));
    } catch {
      setDisplay('Error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 border-4 border-slate-900 rounded-3xl shadow-[10px_10px_0px_0px_rgba(15,23,42,1)] w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white border-b-4 border-slate-900">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            <span className="font-black text-white text-xs uppercase tracking-widest">
              CBT Scientific Calculator
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-slate-800 p-1 rounded-lg border-2 border-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Display */}
        <div className="p-4 bg-slate-950 text-right border-b-4 border-slate-900">
          <div className="text-3xl font-mono font-black text-amber-400 tracking-wider truncate">
            {display}
          </div>
        </div>

        {/* Keypad */}
        <div className="p-4 grid grid-cols-5 gap-2 bg-slate-100 dark:bg-slate-900">
          {buttons.flat().map((btn, idx) => {
            const isOp = ['+', '-', '×', '÷', '='].includes(btn);
            const isAction = ['C', 'DEL'].includes(btn);
            const isTrig = ['sin', 'cos', 'tan', '√'].includes(btn);

            return (
              <button
                key={idx}
                onClick={() => {
                  if (isTrig) handleSpecialFunc(btn);
                  else handleBtn(btn);
                }}
                className={`h-11 rounded-xl text-xs font-black transition border-2 border-slate-900 active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center ${
                  btn === '='
                    ? 'bg-amber-400 text-slate-950 font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                    : isAction
                    ? 'bg-rose-500 text-white font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                    : isOp
                    ? 'bg-blue-600 text-white font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                    : isTrig
                    ? 'bg-emerald-400 text-slate-950 font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                    : 'bg-white hover:bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                }`}
              >
                {btn === 'DEL' ? <Delete className="w-4 h-4" /> : btn}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
