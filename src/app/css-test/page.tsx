import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'

export default function CSSTestPage() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">CSS Test Page</h1>
          <p className="text-gray-300">Testing all CSS classes and effects for the Cashboard application</p>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-4 flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <div>
              <p className="text-sm text-gray-400">CSS Working</p>
              <p className="text-lg font-semibold text-white">✅ Success</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center space-x-3">
            <XCircle className="w-6 h-6 text-red-400" />
            <div>
              <p className="text-sm text-gray-400">CSS Broken</p>
              <p className="text-lg font-semibold text-white">❌ Error</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-yellow-400" />
            <div>
              <p className="text-sm text-gray-400">CSS Warning</p>
              <p className="text-lg font-semibold text-white">⚠️ Warning</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center space-x-3">
            <Info className="w-6 h-6 text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">CSS Info</p>
              <p className="text-lg font-semibold text-white">ℹ️ Info</p>
            </div>
          </div>
        </div>

        {/* Glassmorphism Effects Test */}
        <div className="glass-card p-6 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Glassmorphism Effects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Glass Effect</h3>
              <p className="text-gray-300">Basic glassmorphism with backdrop blur</p>
            </div>
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold text-white mb-2">Glass Card</h3>
              <p className="text-gray-300">Enhanced glassmorphism with shadow</p>
            </div>
            <div className="glass-button p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Glass Button</h3>
              <p className="text-gray-300">Interactive glassmorphism effect</p>
            </div>
          </div>
        </div>

        {/* Color Palette Test */}
        <div className="glass-card p-6 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-400 rounded"></div>
              </div>
              <p className="text-sm text-gray-400">Blue</p>
              <p className="text-xs text-blue-400">bg-blue-500/20</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <div className="w-8 h-8 bg-green-400 rounded"></div>
              </div>
              <p className="text-sm text-gray-400">Green</p>
              <p className="text-xs text-green-400">bg-green-500/20</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <div className="w-8 h-8 bg-yellow-400 rounded"></div>
              </div>
              <p className="text-sm text-gray-400">Yellow</p>
              <p className="text-xs text-yellow-400">bg-yellow-500/20</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <div className="w-8 h-8 bg-purple-400 rounded"></div>
              </div>
              <p className="text-sm text-gray-400">Purple</p>
              <p className="text-xs text-purple-400">bg-purple-500/20</p>
            </div>
          </div>
        </div>

        {/* Typography Test */}
        <div className="glass-card p-6 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Typography</h2>
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-bold text-white">Heading 1 - 4xl Bold</h1>
              <p className="text-sm text-gray-400">text-4xl font-bold text-white</p>
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-white">Heading 2 - 3xl Semibold</h2>
              <p className="text-sm text-gray-400">text-3xl font-semibold text-white</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Heading 3 - xl Semibold</h3>
              <p className="text-sm text-gray-400">text-xl font-semibold text-white</p>
            </div>
            <div>
              <p className="text-lg text-white">Body Large - lg White</p>
              <p className="text-sm text-gray-400">text-lg text-white</p>
            </div>
            <div>
              <p className="text-base text-gray-300">Body Regular - base Gray 300</p>
              <p className="text-sm text-gray-400">text-base text-gray-300</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Body Small - sm Gray 400</p>
              <p className="text-xs text-gray-500">text-sm text-gray-400</p>
            </div>
          </div>
        </div>

        {/* Form Elements Test */}
        <div className="glass-card p-6 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Form Elements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Input Field</label>
              <input
                type="text"
                placeholder="Enter text here..."
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Select Dropdown</label>
              <select className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select an option...</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Textarea</label>
              <textarea
                placeholder="Enter longer text here..."
                rows={3}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Button</label>
              <button className="glass-button px-6 py-2 rounded-lg text-white font-medium">
                Click Me
              </button>
            </div>
          </div>
        </div>

        {/* Grid Layout Test */}
        <div className="glass-card p-6 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Grid Layouts</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">2 Column Grid</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="glass p-4 rounded-lg text-center">
                  <p className="text-white">Column 1</p>
                </div>
                <div className="glass p-4 rounded-lg text-center">
                  <p className="text-white">Column 2</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">3 Column Grid</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="glass p-4 rounded-lg text-center">
                  <p className="text-white">Column 1</p>
                </div>
                <div className="glass p-4 rounded-lg text-center">
                  <p className="text-white">Column 2</p>
                </div>
                <div className="glass p-4 rounded-lg text-center">
                  <p className="text-white">Column 3</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">4 Column Grid</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="glass p-4 rounded-lg text-center">
                  <p className="text-white">Col 1</p>
                </div>
                <div className="glass p-4 rounded-lg text-center">
                  <p className="text-white">Col 2</p>
                </div>
                <div className="glass p-4 rounded-lg text-center">
                  <p className="text-white">Col 3</p>
                </div>
                <div className="glass p-4 rounded-lg text-center">
                  <p className="text-white">Col 4</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spacing Test */}
        <div className="glass-card p-6 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Spacing</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-4 h-4 bg-blue-400 rounded"></div>
              <span className="text-white">space-x-4 (1rem gap)</span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span className="text-white">space-x-6 (1.5rem gap)</span>
            </div>
            <div className="flex items-center space-x-8">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <span className="text-white">space-x-8 (2rem gap)</span>
            </div>
          </div>
        </div>

        {/* Responsive Test */}
        <div className="glass-card p-6 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Responsive Design</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="glass p-4 rounded-lg text-center">
              <p className="text-white font-semibold">Mobile</p>
              <p className="text-sm text-gray-400">1 column</p>
            </div>
            <div className="glass p-4 rounded-lg text-center">
              <p className="text-white font-semibold">Tablet</p>
              <p className="text-sm text-gray-400">2 columns</p>
            </div>
            <div className="glass p-4 rounded-lg text-center">
              <p className="text-white font-semibold">Desktop</p>
              <p className="text-sm text-gray-400">3 columns</p>
            </div>
          </div>
        </div>

        {/* Background Test */}
        <div className="glass-card p-6 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Background Effects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-lg">
              <p className="text-white font-semibold">bg-white/5</p>
              <p className="text-sm text-gray-400">5% white overlay</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <p className="text-white font-semibold">bg-white/10</p>
              <p className="text-sm text-gray-400">10% white overlay</p>
            </div>
            <div className="bg-white/15 p-4 rounded-lg">
              <p className="text-white font-semibold">bg-white/15</p>
              <p className="text-sm text-gray-400">15% white overlay</p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg">
              <p className="text-white font-semibold">bg-white/20</p>
              <p className="text-sm text-gray-400">20% white overlay</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="glass-card p-6 bg-green-500/10 border-green-500/20">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <div>
              <h3 className="text-xl font-semibold text-white">CSS Test Complete!</h3>
              <p className="text-gray-300">If you can see all these elements with proper styling, your CSS is working correctly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 