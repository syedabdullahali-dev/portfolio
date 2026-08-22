'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '@/data/projects';
import { parseVideoUrl } from '@/lib/media';

export default function Lightbox({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (project) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  const video = parseVideoUrl(project?.link);
  const isImage = Boolean(project && project.category !== 'video');

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg/90 p-4 backdrop-blur-xl sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
        >
          <motion.div
            initial={{ scale: 0.94, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 16, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className={
              project.portrait
                ? 'flex max-h-full w-full max-w-sm flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl'
                : 'w-full max-w-4xl overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl'
            }
          >
            <div
              className={`relative w-full ${
                isImage ? 'bg-bg-soft' : 'bg-black'
              } ${project.portrait ? 'aspect-[9/16]' : 'aspect-video'}`}
            >
              {isImage && project.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={project.image}
                  alt={project.title}
                  className="pixelated absolute inset-0 h-full w-full object-contain"
                />
              ) : video ? (
                <iframe
                  src={video.embed}
                  title={project.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              ) : project.video ? (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video src={project.video} controls autoPlay className="h-full w-full" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-center text-muted">
                  <span className="text-3xl">🎬</span>
                  <p className="text-sm">
                    No video linked yet — add a YouTube or Vimeo URL to this project.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-start justify-between gap-4 p-6">
              <div>
                <h3 className="font-display text-xl font-semibold tracking-tight">
                  {project.title}
                </h3>
                <p className="mt-1.5 max-w-lg text-sm text-muted">{project.description}</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-accent/60 hover:text-ink"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
