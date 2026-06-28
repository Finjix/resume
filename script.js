/**
 * 简历导出工具 — PDF 导出 + PNG 导出
 */
(function () {
  'use strict';

  const btnPdf = document.getElementById('btn-pdf');
  const btnPng = document.getElementById('btn-png');

  // ── 按钮状态 ──
  const originalTextMap = new Map();

  function setLoading(btn, loading) {
    if (loading) {
      originalTextMap.set(btn, btn.textContent);
      btn.textContent = '生成中...';
      btn.disabled = true;
    } else {
      btn.textContent = originalTextMap.get(btn) || btn.textContent;
      btn.disabled = false;
    }
  }

  // ── PDF 导出 ──
  function exportPDF() {
    try {
      window.print();
    } catch (err) {
      alert('PDF 导出失败: ' + err.message);
    }
  }

  // ── PNG 导出 ──
  function exportPNG() {
    var page = document.querySelector('.page');
    if (!page) {
      alert('页面结构错误，未找到简历内容元素');
      return;
    }

    if (typeof html2canvas !== 'function') {
      alert('html2canvas 未加载，请检查 lib/html2canvas.min.js');
      return;
    }

    setLoading(btnPng, true);

    try {
      var targetWidth = 1440; // 目标宽度
      var actualWidth = page.offsetWidth || 1;
      var scale = targetWidth / actualWidth;

      html2canvas(page, {
        scale: scale,
        backgroundColor: '#ffffff',
      }).then(function (canvas) {
        var dataUrl = canvas.toDataURL('image/png');

        var a = document.createElement('a');
        a.href = dataUrl;
        a.download = '钟丰骏-简历.png';
        try {
          document.body.appendChild(a);
          a.click();
        } finally {
          if (a.parentNode) {
            a.parentNode.removeChild(a);
          }
        }

        setLoading(btnPng, false);
      }).catch(function (err) {
        alert('PNG 导出失败: ' + err.message);
        console.error(err);
        setLoading(btnPng, false);
      });
    } catch (err) {
      alert('PNG 导出失败: ' + err.message);
      console.error(err);
      setLoading(btnPng, false);
    }
  }

  // ── 绑定事件 ──
  if (btnPdf) {
    btnPdf.addEventListener('click', exportPDF);
  }
  if (btnPng) {
    btnPng.addEventListener('click', exportPNG);
  }
})();
