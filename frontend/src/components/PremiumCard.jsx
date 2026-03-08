import React, { useRef } from 'react';
import { toPng } from 'html-to-image';

const PremiumCard = ({ card, globalLogo, isPreview = false }) => {
  const cardRef = useRef(null);

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
    subtitle2 = '',
    title2 = '',
    headlineWidth = 50,
    subtitleBoxWidth = 100,
    extraTextStyle = {},
    titleStyle = {}, title2Style = {}, subtitleStyle = {}, subtitle2Style = {},
    subImage, subImagePosition = 'left', subImageSize = 40,
    subImageFit = 'contain', subImageObjectPosition = 'center'
  } = card;

  // Dynamic image styling based on size and position
  const imageDynamicStyle = {
    objectFit: imageFit, // Cover (fill height) or Contain
    objectPosition: imageObjectPosition
  };
  if (imagePosition === 'left' || imagePosition === 'right') {
    imageDynamicStyle.width = `${imageSize}%`;
    imageDynamicStyle.height = '100%';
  } else {
    imageDynamicStyle.height = `${imageSize}%`;
    imageDynamicStyle.width = '100%';
  }

  const subImageDynamicStyle = {
    objectFit: subImageFit,
    objectPosition: subImageObjectPosition,
    zIndex: 2
  };

  if (subImagePosition === 'left' || subImagePosition === 'right') {
    subImageDynamicStyle.width = `${subImageSize}%`;
    subImageDynamicStyle.height = '100%';
  } else {
    subImageDynamicStyle.height = `${subImageSize}%`;
    subImageDynamicStyle.width = '100%';
  }

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

  // Handle local vs remote image vs preview blob
  const imageUrl = (image.startsWith('http') || image.startsWith('blob:') || image.startsWith('data:'))
    ? image
    : `/${image}`;
  const logoUrl = globalLogo ? (globalLogo.startsWith('http') ? globalLogo : `/${globalLogo}`) : null;
  const subImageUrl = subImage ? (
    (subImage.startsWith('http') || subImage.startsWith('blob:') || subImage.startsWith('data:'))
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
          // Exclude the download button from the final image
          if (node.classList && node.classList.contains('download-btn-overlay')) {
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
      <div className={`premium-card pos-${imagePosition}`} ref={cardRef}>
        {/* Uploaded Subject Image */}
        <img
          src={imageUrl}
          alt={title}
          className="card-image-subject"
          style={imageDynamicStyle}
          crossOrigin="anonymous"
        />

        {/* Sub-Subject Image */}
        {subImageUrl && (
          <img
            src={subImageUrl}
            alt="Sub Subject"
            className={`card-sub-image sub-pos-${subImagePosition}`}
            style={subImageDynamicStyle}
            crossOrigin="anonymous"
          />
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
                  <div className="card-logo-name">WhiteswanTv<br />NEWS</div>
                </>
              )}
            </div>
          </div>

          {/* Text Content on the Left */}
          <div className="card-content-side" style={{ width: `${headlineWidth}%`, marginTop: '-8px' }}>
            {title && <h2 className="card-title-main" style={titleInlineStyle}>{title}</h2>}
            {title2 && <h2 className="card-title-main" style={{ ...title2InlineStyle, marginTop: '0' }}>{title2}</h2>}

            {subtitle && (
              subtitleShowBox ? (
                <div
                  className="card-subtitle-box"
                  style={{
                    background: subtitleBoxColor,
                    padding: '4px 12px',
                    borderRadius: '20px',
                    display: 'inline-block',
                    width: `${subtitleBoxWidth}%`,
                    marginTop: '5px'
                  }}
                >
                  <p className="card-subtitle-main" style={{ ...subtitleInlineStyle, marginTop: 0 }}>{subtitle}</p>
                </div>
              ) : (
                <p className="card-subtitle-main" style={subtitleInlineStyle}>{subtitle}</p>
              )
            )}

            {subtitle2 && (
              <p className="card-subtitle-2" style={{ ...subtitle2InlineStyle, marginTop: '8px' }}>{subtitle2}</p>
            )}

            {extraTextShow && extraText && (
              <div
                className="card-highlight-box"
                style={{
                  background: extraTextBgColor,
                  padding: '6px 16px',
                  borderRadius: '30px',
                  marginTop: '15px',
                  width: 'fit-content',
                  display: 'inline-block'
                }}
              >
                <p
                  style={{
                    ...extraTextInlineStyle,
                    margin: 0,
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

        {/* Download Button Overlay - Hidden during capture */}
        {!isPreview && (
          <button className="download-btn-overlay" onClick={handleDownload} title="Download as Image">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download
          </button>
        )}
      </div>
    </div>
  );
};

export default PremiumCard;
