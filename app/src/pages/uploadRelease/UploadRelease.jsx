import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UploadRelease = () => {

  const navigate = useNavigate()
  return (
    <div className="min-h-screen  p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-semibold mb-2">Upload Release</h1>
          <p className="text-slate-400 text-sm">Upload your music and distribute it to all major platforms</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Release Builder Card */}
          <div 
            className="relative  border-2 border-dashed border-slate-600 rounded-lg p-12 hover:border-slate-500 transition-colors cursor-pointer group"
            onClick={() => navigate('/app/upload-release/basic-release-builder')}
          >
            <div className="flex flex-col items-center justify-center text-center h-48">
              <div className="mb-6">
                <Plus className="w-12 h-12 text-slate-400 group-hover:text-slate-300 transition-colors" />
              </div>
              <h3 className=" text-xl font-medium mb-2">Basic release builder</h3>
            </div>
          </div>

          {/* Advanced Release Builder Card */}
          <div 
            className="relative  border-2 border-dashed border-slate-600 rounded-lg p-12 hover:border-slate-500 transition-colors cursor-pointer group"
            onClick={() => navigate('/app/upload-release/advanced-release-builder')}
          >
            <div className="flex flex-col items-center justify-center text-center h-48">
              <div className="mb-6">
                <Plus className="w-12 h-12 text-slate-400 group-hover:text-slate-300 transition-colors" />
              </div>
              <h3 className=" text-xl font-medium mb-2">Advanced release builder</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadRelease;