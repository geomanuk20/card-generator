import React, { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';

const parsePosition = (posStr) => {
  if (!posStr) return { x: 50, y: 50 };
  if (posStr === 'center') return { x: 50, y: 50 };
  if (posStr === 'top') return { x: 50, y: 0 };
  if (posStr === 'bottom') return { x: 50, y: 100 };
  if (posStr === 'left') return { x: 0, y: 50 };
  if (posStr === 'right') return { x: 100, y: 50 };
  if (posStr === 'top left') return { x: 0, y: 0 };
  if (posStr === 'top right') return { x: 100, y: 0 };
  if (posStr === 'bottom left') return { x: 0, y: 100 };
  if (posStr === 'bottom right') return { x: 100, y: 100 };
  if (posStr === 'left center') return { x: 0, y: 50 };
  if (posStr === 'right center') return { x: 100, y: 50 };
  if (posStr === 'center top') return { x: 50, y: 0 };
  if (posStr === 'center bottom') return { x: 50, y: 100 };
  if (posStr.includes('%')) {
    const parts = posStr.split(' ');
    const x = parseFloat(parts[0]);
    const y = parseFloat(parts[1] !== undefined ? parts[1] : parts[0]);
    return { x: isNaN(x) ? 50 : x, y: isNaN(y) ? 50 : y };
  }
  return { x: 50, y: 50 };
};

const PremiumCard = ({ card, globalLogo, isPreview = false, onImagePositionChange, activeEditTarget = 'main', onTargetSelect, onEdit }) => {
  const cardRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragTargetRef = useRef(activeEditTarget);
  const dragStartRef = useRef(null);

  useEffect(() => {
    if (!isDragging) {
      dragTargetRef.current = activeEditTarget;
    }
  }, [activeEditTarget, isDragging]);

  const updatePosition = (e, currentTarget) => {
    if (!cardRef.current || !dragStartRef.current) return;
    const isFree = currentTarget === 'main' ? card.imagePosition === 'free' : card.subImagePosition === 'free';
    const rect = cardRef.current.getBoundingClientRect();
    
    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;
    
    let percentDeltaX = (deltaX / rect.width) * 100;
    let percentDeltaY = (deltaY / rect.height) * 100;
    
    let newX, newY;
    if (isFree) {
      newX = dragStartRef.current.startPosX + percentDeltaX;
      newY = dragStartRef.current.startPosY + percentDeltaY;
    } else {
      newX = dragStartRef.current.startPosX - percentDeltaX;
      newY = dragStartRef.current.startPosY - percentDeltaY;
      newX = Math.max(0, Math.min(100, newX));
      newY = Math.max(0, Math.min(100, newY));
    }

    const newPos = `${Math.round(newX)}% ${Math.round(newY)}%`;
    if (onImagePositionChange) {
      onImagePositionChange(newPos, currentTarget);
    }
  };

  const handleMouseDown = (e) => {
    if (!isPreview) return;
    if (e.target.closest('button')) return; // Ignore drag if clicking on the download button or other buttons
    
    let target = activeEditTarget;
    if (e.target.closest('.sub-image-container') || e.target.classList.contains('card-sub-image')) {
      target = 'sub';
    } else if (e.target.closest('.subject-image-container') || e.target.classList.contains('card-image-subject')) {
      target = 'main';
    }

    if (onTargetSelect && target !== activeEditTarget) {
      onTargetSelect(target);
    }
    
    dragTargetRef.current = target;
    const posStr = target === 'main' ? card.imageObjectPosition : card.subImageObjectPosition;
    const currentPos = parsePosition(posStr);
    
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: currentPos.x,
      startPosY: currentPos.y
    };
    
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isPreview || !isDragging) return;
    updatePosition(e, dragTargetRef.current);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!card) return null;

  const {
    title, subtitle, date, image, imagePosition = 'right',
    imageSize = 70,
    imageFit = 'cover',
    imageObjectPosition = 'center',
    footerStyle = 'split',
    footerText = 'www.whiteswantvnews.com',
    footerBgColor = '#f8f107',
    footerContentColor = '#000000',
    dateBgColor = '#2ba5bc',
    subtitleShowBox = false,
    subtitleBoxColor = 'rgba(0,0,0,0.5)',
    extraText = '',
    extraTextShow = false,
    extraTextBgColor = '#1e4b8f',
    extraTextWidth = 100,
    subtitle2 = '',
    title2 = '',
    headlineWidth = 50,
    subtitleBoxWidth = 100,
    extraTextStyle = {},
    titleStyle = {}, title2Style = {}, subtitleStyle = {}, subtitle2Style = {},
    subImage, subImagePosition = 'left', subImageSize = 40,
    subImageFit = 'contain', subImageObjectPosition = 'center',
    cardBgColor = '#002d72',
    contentVerticalOffset = -8
  } = card;

  // Dynamic image styling based on size and position
  const imageDynamicStyle = {
    objectFit: imageFit // Cover (fill height) or Contain
  };
  
  // Conditionally add objectPosition since free removes it
  if (imagePosition !== 'free') {
    imageDynamicStyle.objectPosition = imageObjectPosition;
  }

  if (imagePosition === 'left' || imagePosition === 'right') {
    imageDynamicStyle.width = `${imageSize}%`;
    imageDynamicStyle.height = '100%';
  } else if (imagePosition === 'free') {
    const pos = parsePosition(imageObjectPosition);
    imageDynamicStyle.position = 'absolute';
    imageDynamicStyle.left = `${pos.x}%`;
    imageDynamicStyle.top = `${pos.y}%`;
    imageDynamicStyle.transform = 'translate(-50%, -50%)';
    imageDynamicStyle.width = `${imageSize}%`;
    imageDynamicStyle.height = 'auto'; // allow original aspect ratio
    imageDynamicStyle.margin = '0';
  } else {
    imageDynamicStyle.height = `${imageSize}%`;
    imageDynamicStyle.width = '100%';
  }

  const subImageDynamicStyle = {
    objectFit: subImageFit,
    width: '100%',
    height: '100%'
  };

  if (subImagePosition !== 'free') {
    subImageDynamicStyle.objectPosition = subImageObjectPosition;
  }

  const subImageContainerStyle = {
    zIndex: 3
  };

  if (subImagePosition === 'left' || subImagePosition === 'right') {
    subImageContainerStyle.width = `${subImageSize}%`;
    subImageContainerStyle.height = '100%';
  } else if (subImagePosition === 'free') {
    const pos = parsePosition(subImageObjectPosition);
    subImageContainerStyle.position = 'absolute';
    subImageContainerStyle.left = `${pos.x}%`;
    subImageContainerStyle.top = `${pos.y}%`;
    subImageContainerStyle.transform = 'translate(-50%, -50%)';
    subImageContainerStyle.width = `${subImageSize}%`;
    subImageContainerStyle.height = 'auto';
    subImageDynamicStyle.height = 'auto';
  } else {
    subImageContainerStyle.height = `${subImageSize}%`;
    subImageContainerStyle.width = '100%';
  }

  // Helper for condensed Malayalam
  const getFontClass = (family) => family === 'Anek Malayalam Condensed' ? 'anek-condensed' : '';

  const titleInlineStyle = {
    fontSize: titleStyle.fontSize || '2.8rem',
    fontWeight: titleStyle.fontWeight || '900',
    fontFamily: titleStyle.fontFamily ? `'${titleStyle.fontFamily}', ${titleStyle.fontFamily === 'Playfair Display' ? 'serif' : 'sans-serif'}` : "'Inter', sans-serif",
    color: titleStyle.color || '#f8f107',
    textDecoration: titleStyle.underline ? 'underline' : 'none',
    lineHeight: 1.4,
  };

  const title2InlineStyle = {
    fontSize: title2Style.fontSize || '2.8rem',
    fontWeight: title2Style.fontWeight || '900',
    fontFamily: title2Style.fontFamily ? `'${title2Style.fontFamily}', ${title2Style.fontFamily === 'Playfair Display' ? 'serif' : 'sans-serif'}` : "'Inter', sans-serif",
    color: title2Style.color || '#f8f107',
    textDecoration: title2Style.underline ? 'underline' : 'none',
    lineHeight: 1.4,
  };

  const subtitleInlineStyle = {
    fontSize: subtitleStyle.fontSize || '1rem',
    fontWeight: subtitleStyle.fontWeight || 'normal',
    fontFamily: subtitleStyle.fontFamily ? `'${subtitleStyle.fontFamily}', sans-serif` : "'Inter', sans-serif",
    color: subtitleStyle.color || '#ffffff',
    textDecoration: subtitleStyle.underline ? 'underline' : 'none',
  };

  const subtitle2InlineStyle = {
    fontSize: subtitle2Style.fontSize || '1rem',
    fontWeight: subtitle2Style.fontWeight || 'normal',
    fontFamily: subtitle2Style.fontFamily ? `'${subtitle2Style.fontFamily}', sans-serif` : "'Inter', sans-serif",
    color: subtitle2Style.color || '#f8f107',
    textDecoration: subtitle2Style.underline ? 'underline' : 'none',
  };

  const extraTextInlineStyle = {
    fontSize: extraTextStyle.fontSize || '0.9rem',
    fontWeight: extraTextStyle.fontWeight || 'bold',
    fontFamily: extraTextStyle.fontFamily ? `'${extraTextStyle.fontFamily}', sans-serif` : "'Anek Malayalam', sans-serif",
    color: extraTextStyle.color || '#ffffff',
    textDecoration: extraTextStyle.underline ? 'underline' : 'none',
  };

  // Split date into day and month/year for the badge
  const dateObj = new Date(date);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
  const year = dateObj.getFullYear();

  // Helper for safe string checks
  const safeStartsWith = (str, prefix) => typeof str === 'string' && str.startsWith(prefix);

  // Handle local vs remote image vs preview blob
  const imageUrl = (safeStartsWith(image, 'http') || safeStartsWith(image, 'blob:') || safeStartsWith(image, 'data:'))
    ? image
    : (image ? `/${image}` : 'https://via.placeholder.com/800x600?text=Upload+Image');

  const logoUrl = globalLogo ? (safeStartsWith(globalLogo, 'http') ? globalLogo : `/${globalLogo}`) : null;
  
  const subImageUrl = subImage ? (
    (safeStartsWith(subImage, 'http') || safeStartsWith(subImage, 'blob:') || safeStartsWith(subImage, 'data:'))
      ? subImage
      : `/${subImage}`
  ) : null;

  const handleDownload = async () => {
    if (cardRef.current === null) return;

    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        filter: (node) => {
          // Exclude markers and UI from capture
          if (node.classList && (
            node.classList.contains('card-actions-overlay') || 
            node.classList.contains('action-btn-overlay') || 
            node.classList.contains('image-edit-trigger')
          )) {
            return false;
          }
          return true;
        }
      });

      const link = document.createElement('a');
      link.download = `news-card-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Could not download image', err);
    }
  };

  return (
    <div className="card-container-wrapper">
      <div 
        className={`premium-card pos-${imagePosition} ${isPreview ? 'is-preview' : ''} ${isDragging ? 'is-dragging' : ''}`} 
        ref={cardRef}
        onMouseDown={handleMouseDown}
        style={{ backgroundColor: cardBgColor }}
      >
        {/* Uploaded Subject Image Wrapper */}
        <div className={`subject-image-container ${isPreview && activeEditTarget === 'main' ? 'active-edit' : ''}`}>
          <img
            src={imageUrl}
            alt={title}
            className="card-image-subject"
            style={imageDynamicStyle}
            crossOrigin="anonymous"
          />
          {isPreview && (
            <button 
              className={`image-edit-trigger main ${activeEditTarget === 'main' ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); onTargetSelect && onTargetSelect('main'); }}
              title="Edit Main Image Position"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
              <span>Main</span>
            </button>
          )}
        </div>

        {/* Sub-Subject Image Wrapper */}
        {subImageUrl && (
          <div 
            className={`sub-image-container sub-pos-${subImagePosition} ${isPreview && activeEditTarget === 'sub' ? 'active-edit' : ''}`}
            style={subImageContainerStyle}
          >
            <img
              src={subImageUrl}
              alt="Sub Subject"
              className={`card-sub-image ${isPreview && activeEditTarget === 'sub' ? 'is-preview-target' : ''}`}
              style={subImageDynamicStyle}
              crossOrigin="anonymous"
            />
            {isPreview && (
              <button 
                className={`image-edit-trigger sub ${activeEditTarget === 'sub' ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); onTargetSelect && onTargetSelect('sub'); }}
                title="Edit Sub Image Position"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                <span>Sub</span>
              </button>
            )}
          </div>
        )}

        {/* Main UI Overlay */}
        <div className="card-main-layout">
          <div className="card-header-top">
            {/* Vertical Date Badge */}
            <div className="date-badge-v" style={{ background: 'none' }}>
              <span className="year">{year}</span>
              <div className="separator"></div>
              <div className="day-month" style={{ background: dateBgColor, padding: '4px', borderRadius: '4px' }}>
                <span className="day">{day}</span>
                <span className="month">{month}</span>
              </div>
            </div>

            {/* Logo Section */}
            <div className="card-logo-placeholder">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="uploaded-logo"
                  crossOrigin="anonymous"
                />
              ) : (
                <>
                  <div className="card-logo-icon">🔥</div>
                  <div className="card-logo-text">
                    <div className="brand-name">WhiteswanTv</div>
                    <div className="brand-news">NEWS</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Text Content on the Left */}
          <div className="card-content-side" style={{ width: `${headlineWidth}%`, marginTop: `${contentVerticalOffset}px` }}>
            {title && <h2 className={`card-title-main ${getFontClass(titleStyle.fontFamily)}`} style={titleInlineStyle}>{title}</h2>}
            {title2 && <h2 className={`card-title-main ${getFontClass(title2Style.fontFamily)}`} style={{ ...title2InlineStyle, marginTop: '0' }}>{title2}</h2>}

            {subtitle && (
              <div 
                className="subtitle-wrapper" 
                style={{ width: `${subtitleBoxWidth}%` }}
              >
                {subtitleShowBox ? (
                  <div
                    className="card-subtitle-box"
                    style={{
                      background: subtitleBoxColor,
                      padding: '4px 12px',
                      borderRadius: '20px',
                      display: 'inline-block',
                      width: '100%',
                      marginTop: '5px'
                    }}
                  >
                    <p className={`card-subtitle-main ${getFontClass(subtitleStyle.fontFamily)}`} style={{ ...subtitleInlineStyle, marginTop: 0 }}>{subtitle}</p>
                  </div>
                ) : (
                  <p className={`card-subtitle-main ${getFontClass(subtitleStyle.fontFamily)}`} style={{ ...subtitleInlineStyle, width: '100%' }}>{subtitle}</p>
                )}
              </div>
            )}

            {subtitle2 && (
              <div 
                className="subtitle2-wrapper" 
                style={{ width: `${subtitleBoxWidth}%`, marginTop: '8px' }}
              >
                <p className={`card-subtitle-2 ${getFontClass(subtitle2Style.fontFamily)}`} style={{ ...subtitle2InlineStyle, width: '100%', marginTop: 0 }}>{subtitle2}</p>
              </div>
            )}

            {extraTextShow && extraText && (
              <div
                className="card-highlight-box"
                style={{
                  background: extraTextBgColor,
                  padding: '6px 16px',
                  borderRadius: '30px',
                  marginTop: '15px',
                  width: `${extraTextWidth}%`,
                  display: 'block'
                }}
              >
                <p
                  className={getFontClass(extraTextStyle.fontFamily)}
                  style={{
                    ...extraTextInlineStyle,
                    margin: 0,
                    width: '100%'
                  }}
                >
                  {extraText}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Yellow Footer Bar */}
        <div
          className={`card-footer-bar style-${footerStyle}`}
          style={{
            background: footerBgColor,
            color: footerContentColor
          }}
        >
          {footerStyle !== 'icons' && (
            <span className="card-footer-url" style={{ color: footerContentColor }}>{footerText}</span>
          )}

          <div className="social-icons-placeholder">
            {/* Facebook */}
            <div className="icon-circle" style={{ color: footerContentColor }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </div>
            {/* Twitter/X */}
            <div className="icon-circle" style={{ color: footerContentColor }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
            </div>
            {/* Instagram */}
            <div className="icon-circle" style={{ color: footerContentColor }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </div>
            {/* YouTube */}
            <div className="icon-circle" style={{ color: footerContentColor }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Download & Edit Button Overlay - Hidden during capture */}
        {!isPreview && (
          <div className="card-actions-overlay">
            <button className="action-btn-overlay" onClick={handleDownload} title="Download as Image">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download
            </button>
            {onEdit && (
              <button className="action-btn-overlay edit-btn" onClick={onEdit} title="Edit Card">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumCard;
