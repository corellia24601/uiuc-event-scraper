'use client';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, CheckCircle, AlertCircle, Globe, Calendar } from 'lucide-react';

interface ScrapingLoaderProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'checking' | 'initializing' | 'scraping' | 'success' | 'error';
  progress?: number;
  message?: string;
  eventsFound?: number;
  currentSource?: string;
}

export function ScrapingLoader({
  isOpen,
  onClose,
  status,
  progress = 0,
  message = '',
  eventsFound = 0,
  currentSource = '',
}: ScrapingLoaderProps) {
  const isLoading = status === 'checking' || status === 'initializing' || status === 'scraping';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isLoading ? onClose : undefined}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-6">
            <motion.div
              className="bg-white rounded-3xl p-12 max-w-lg w-full shadow-2xl relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: 'spring', duration: 0.6 }}
            >
              {/* Animated gradient background */}
              <motion.div
                className="absolute inset-0 opacity-10"
                animate={{
                  background: [
                    'linear-gradient(45deg, #7C3AED, #06B6D4)',
                    'linear-gradient(90deg, #06B6D4, #F59E0B)',
                    'linear-gradient(135deg, #F59E0B, #7C3AED)',
                    'linear-gradient(180deg, #7C3AED, #06B6D4)',
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />

              <div className="relative z-10">
                {/* Status Icon */}
                <div className="flex justify-center mb-8">
                  {isLoading && (
                    <motion.div
                      className="relative"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                          <Globe className="w-12 h-12 text-white" />
                        </motion.div>
                      </div>
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-3 h-3 bg-blue-500 rounded-full"
                          style={{ top: '50%', left: '50%' }}
                          animate={{
                            x: [0, Math.cos((i * 120 * Math.PI) / 180) * 60],
                            y: [0, Math.sin((i * 120 * Math.PI) / 180) * 60],
                            opacity: [0, 1, 0],
                          }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
                        />
                      ))}
                    </motion.div>
                  )}
                  {status === 'success' && (
                    <motion.div
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', duration: 0.8 }}
                    >
                      <CheckCircle className="w-12 h-12 text-white" />
                    </motion.div>
                  )}
                  {status === 'error' && (
                    <motion.div
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5, repeat: 2 }}
                    >
                      <AlertCircle className="w-12 h-12 text-white" />
                    </motion.div>
                  )}
                </div>

                <motion.h2
                  className="text-3xl text-center mb-4 font-extrabold text-slate-900"
                  style={{ fontFamily: 'Montserrat, var(--font-montserrat, sans-serif)' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {status === 'checking' && 'Loading…'}
                  {status === 'initializing' && 'Setting Up Sources'}
                  {status === 'scraping' && 'Scraping Events…'}
                  {status === 'success' && 'Success!'}
                  {status === 'error' && 'Error Occurred'}
                </motion.h2>

                <motion.p
                  className="text-gray-600 text-center mb-8"
                  style={{ fontFamily: 'Montserrat, var(--font-montserrat, sans-serif)', fontWeight: 400 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {currentSource ? (
                    <>Scraping <span className="text-blue-600 font-semibold">{currentSource}</span></>
                  ) : message || (
                    status === 'initializing' ? 'Loading 900+ UIUC event sources…' :
                    status === 'scraping' ? 'Collecting events from all sources…' :
                    status === 'checking' ? 'Checking database…' : ''
                  )}
                </motion.p>

                {/* Progress bar */}
                {(status === 'initializing' || status === 'scraping') && (
                  <div className="mb-8">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>Progress</span>
                      <span className="text-blue-600 font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>{progress}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                    {status === 'scraping' && (
                      <p className="text-xs text-slate-400 mt-2 text-center">This takes 3–5 minutes on first run.</p>
                    )}
                  </div>
                )}

                {/* Events found counter */}
                {eventsFound > 0 && (
                  <motion.div
                    className="bg-blue-50 rounded-2xl p-6 mb-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <Calendar className="w-6 h-6 text-blue-600" />
                      <div>
                        <div className="text-sm text-gray-600 font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>Events Found</div>
                        <motion.div
                          className="text-3xl text-blue-600 font-extrabold"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                        >
                          {eventsFound}
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Animated dots during loading */}
                {isLoading && (
                  <div className="flex justify-center gap-2 mb-6">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-blue-500 rounded-full"
                        animate={{ y: [0, -10, 0], opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                )}

                {/* Action button for success/error */}
                {!isLoading && (
                  <motion.button
                    onClick={onClose}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {status === 'success' ? 'View Events' : 'Try Again'}
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
