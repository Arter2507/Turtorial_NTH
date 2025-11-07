import React, { useRef, useState } from 'react';
import { useToast } from '../lib/toast';

// Endpoint for the Apps Script Web App. Prefer setting VITE_FEEDBACK_ENDPOINT in .env for Vite.
// Fallback: edit this file and set the URL string below if you prefer.
const FEEDBACK_ENDPOINT = (import.meta as unknown as { env?: { VITE_FEEDBACK_ENDPOINT?: string } }).env?.VITE_FEEDBACK_ENDPOINT || '';

const exec = (command: string) => {
  try {
    // document.execCommand is deprecated but may be present; call safely
    const doc: unknown = document;
    const maybeExec = (doc as { execCommand?: (cmd: string) => boolean }).execCommand;
    if (typeof maybeExec === 'function') maybeExec.call(document, command);
  } catch (e) {
    // ignore
  }
};

export const FeedbackButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const showToast = useToast();

  const clearForm = () => {
    setTitle('');
    if (contentRef.current) contentRef.current.innerHTML = '';
    setMessage(null);
  };

  const handleSubmit = async () => {
    if (!FEEDBACK_ENDPOINT) {
      setMessage('Vui lòng cấu hình FEEDBACK_ENDPOINT (xem docs/FEEDBACK_APPS_SCRIPT.md)');
      return;
    }
    const content = contentRef.current?.innerHTML || '';
    if (!title.trim() && !content.trim()) {
      setMessage('Vui lòng nhập Tiêu đề hoặc Nội dung.');
      return;
    }
    setSubmitting(true);
    setMessage(null);

    try {
      const timestamp = new Date().toISOString();
      const isAppsScript = FEEDBACK_ENDPOINT.includes('script.google.com');

      let res: Response;
  if (FEEDBACK_ENDPOINT.includes('docs.google.com/forms')) {
        // Sending directly to Google Form's formResponse endpoint.
        // The FEEDBACK_ENDPOINT should be the formResponse URL, e.g.
        // https://docs.google.com/forms/d/e/<FORM_ID>/formResponse
        // The form expects fields named like entry.123456789
        const params = new URLSearchParams();
        // Map user's inputs to the provided entry IDs
        // entry IDs: email -> entry.207403457, title -> entry.2134557201, content -> entry.416051144
        params.append('entry.207403457', email.trim());
        params.append('entry.2134557201', title.trim());
        params.append('entry.416051144', content);
        // optionally include timestamp field if form has one (not required)
        params.append('timestamp', timestamp);

        try {
          res = await fetch(FEEDBACK_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: params.toString(),
          });
        } catch (fetchErr) {
          // Google Forms sometimes return responses that the browser blocks by CORS
          // even though the submission succeeds (sheet updated). Treat as success
          // for user experience while still logging the issue for debugging.
          console.warn('Fetch to Google Form failed (CORS/opaque response). Assuming success.', fetchErr);
          setMessage('Gửi góp ý thành công — (lưu vào Google Form).');
          try {
            showToast('Gửi góp ý thành công — đã lưu vào Google Form', 'success');
          } catch (e) {
            console.warn(e);
          }
          clearForm();
          setTimeout(() => setOpen(false), 1000);
          setSubmitting(false);
          return;
        }
      } else if (isAppsScript) {
        // Google Apps Script web apps often reject preflight OPTIONS for JSON requests.
        // Sending form-urlencoded avoids the preflight and works reliably.
        const params = new URLSearchParams();
        params.append('title', title.trim());
        params.append('content', content);
        params.append('timestamp', timestamp);

        res = await fetch(FEEDBACK_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: params.toString(),
        });
      } else {
        const payload = { title: title.trim(), content, timestamp };
        res = await fetch(FEEDBACK_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const responseText = await res.text();
      let jsonData: Record<string, unknown> | null = null;
      try {
        jsonData = JSON.parse(responseText || '{}');
      } catch (e) {
        // ignore
      }

  if (!res.ok) {
        const maybeMsg = jsonData && 'message' in jsonData ? jsonData.message : responseText || `Server returned ${res.status}`;
        const msgStr = typeof maybeMsg === 'string' ? maybeMsg : String(maybeMsg);
        throw new Error(msgStr);
      }

      const successMsg = jsonData && 'message' in jsonData && typeof jsonData.message === 'string'
        ? jsonData.message
        : 'Gửi góp ý thành công — cảm ơn bạn!';
      setMessage(successMsg);
      try {
        showToast(typeof successMsg === 'string' ? successMsg : 'Gửi góp ý thành công', 'success');
      } catch (e) {
        console.warn(e);
      }
      clearForm();
      setTimeout(() => setOpen(false), 1000);
    } catch (err: unknown) {
      console.error(err);
      setMessage(`Gửi thất bại: ${err instanceof Error ? err.message : 'Lỗi không xác định.'}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating circular button */}
      <button
        title="Góp ý thêm thông tin"
        aria-label="Góp ý thêm thông tin"
        onClick={() => setOpen(true)}
        // Place on bottom-right to sit beside the ScrollToTopButton (which is moved to bottom-left)
        className="fixed z-50 right-4 bottom-8 md:right-8 md:bottom-8 bg-sky-600 hover:bg-sky-500 text-white p-3 md:p-4 rounded-full shadow-xl focus:outline-none focus:ring-2 focus:ring-sky-300"
      >
        <span className="sr-only">Góp ý</span>
        {/* simple pencil icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
          <path fillRule="evenodd" d="M2 15a1 1 0 011-1h3.586l8.707-8.707a4 4 0 015.657 5.657L12.243 19.657A4 4 0 017.586 19H3a1 1 0 01-1-1v-3z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          <div className="relative bg-white dark:bg-slate-800 rounded-lg w-full max-w-2xl mx-4 p-6 shadow-2xl border border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Góp ý thông tin</h3>

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Tiêu đề góp ý</label>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mt-3">Email (tuỳ chọn)</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm p-2"
              placeholder="Email liên hệ (không bắt buộc)"
            />
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm p-2"
              placeholder="Tiêu đề ngắn gọn"
            />

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Nội dung</label>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => exec('bold')} title="Đậm" className="px-2 py-1 text-sm rounded bg-gray-100 dark:bg-slate-700">B</button>
                  <button type="button" onClick={() => exec('italic')} title="Nghiêng" className="px-2 py-1 text-sm rounded bg-gray-100 dark:bg-slate-700">I</button>
                  <button type="button" onClick={() => exec('insertUnorderedList')} title="Danh sách" className="px-2 py-1 text-sm rounded bg-gray-100 dark:bg-slate-700">• List</button>
                  <button type="button" onClick={() => exec('insertOrderedList')} title="Danh sách đánh số" className="px-2 py-1 text-sm rounded bg-gray-100 dark:bg-slate-700">1. List</button>
                  <button type="button" onClick={() => exec('removeFormat')} title="Xóa format" className="px-2 py-1 text-sm rounded bg-gray-100 dark:bg-slate-700">Clear</button>
                </div>
              </div>

              <div
                ref={contentRef}
                contentEditable
                role="textbox"
                aria-label="Nội dung góp ý"
                aria-multiline
                className="mt-2 min-h-[120px] rounded-md border border-gray-300 dark:border-slate-600 p-3 text-sm bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-300 overflow-auto"
                suppressContentEditableWarning
                onKeyDown={(e) => {
                  // Submit on Ctrl/Cmd+Enter
                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
            </div>

            {message && <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">{message}</p>}

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={clearForm}
                className="px-3 py-2 rounded-md bg-gray-100 dark:bg-slate-700 text-sm"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-md bg-white border border-gray-200 dark:bg-slate-800 dark:border-slate-700 text-sm"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="px-4 py-2 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-sm disabled:opacity-60"
              >
                {submitting ? 'Đang gửi...' : 'Gửi góp ý'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackButton;
