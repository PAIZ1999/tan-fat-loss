import html2canvas from 'html2canvas';

export async function exportPosterImage(elementId: string, fileName: string = '减脂饮食打卡海报.png') {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('未能获取到生成区域');
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // 2倍高清
      useCORS: true,
      backgroundColor: '#090d16',
      logging: false,
      // 关键：精确锁定截图范围为目标元素的尺寸，避免截到页面其他内容
      width: element.scrollWidth,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      onclone: (clonedDoc) => {
        const clonedEl = clonedDoc.getElementById(elementId);
        if (clonedEl) {
          // 将克隆的海报元素从离屏位置重置到正常文档流
          clonedEl.style.position = 'static';
          clonedEl.style.left = 'auto';
          clonedEl.style.top = 'auto';
          clonedEl.style.transform = 'none';
          clonedEl.style.visibility = 'visible';
          clonedEl.style.display = 'block';
          clonedEl.style.opacity = '1';
          clonedEl.style.width = '700px';
          clonedEl.style.overflow = 'visible';

          // 修复父容器：确保离屏隐藏属性被完全重置
          let parent = clonedEl.parentElement;
          while (parent && parent !== clonedDoc.body) {
            parent.style.position = 'static';
            parent.style.left = 'auto';
            parent.style.top = 'auto';
            parent.style.opacity = '1';
            parent.style.visibility = 'visible';
            parent.style.display = 'block';
            parent.style.overflow = 'visible';
            parent.style.pointerEvents = 'auto';
            parent.style.zIndex = 'auto';
            parent.style.width = 'auto';
            parent.style.height = 'auto';
            parent = parent.parentElement;
          }
        }
      },
    });

    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('导出海报失败:', error);
    alert('导出海报图片失败，请稍后重试');
  }
}
