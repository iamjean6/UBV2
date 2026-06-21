import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="bg-gray-700 border border-white rounded-xl shadow-2xl p-6 w-full max-w-md"
                    >
                        <h3 className="text-xl font-bold text-white mb-2">
                            {title || 'Confirm Deletion'}
                        </h3>
                        <p className="text-white mb-6">
                            {message || 'Are you sure you want to delete this item? This action cannot be undone.'}
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg bg-[var(--bg-2)] text-white hover:bg-[var(--bg-3)] transition-colors border border-[var(--border)]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
                            >
                                Delete
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmDeleteModal;
