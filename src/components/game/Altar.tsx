import classNames from 'classnames';
import React from 'react';
import { Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaEye } from 'react-icons/fa';
import styled, { css, keyframes } from 'styled-components';
import { RankData } from './rules/ranks';
import { RarityInfo } from './rules/rarity';

const hoverFloat = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const pulseGlow = keyframes`
  0% {
    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4)) drop-shadow(0px 0px 12px rgba(255, 230, 150, 0.5));
  }
  50% {
    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4)) drop-shadow(0px 0px 20px rgba(255, 230, 150, 0.7));
  }
  100% {
    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4)) drop-shadow(0px 0px 12px rgba(255, 230, 150, 0.5));
  }
`;

const StyledEgg = styled.img<{ hasGlow?: boolean }>`
  width: 54%;
  height: auto;
  z-index: 3;
  position: relative;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.4));
  animation: ${hoverFloat} 3s ease-in-out infinite;

  ${(props) =>
    props.hasGlow &&
    css`
      /* When glowing, the pulse animation takes over the filter property */
      animation:
        ${hoverFloat} 3s ease-in-out infinite,
        ${pulseGlow} 2.5s ease-in-out infinite;
    `}
`;

const AltarImage = styled.img``;

export interface AltarProps {
  id: string;
  title: string;
  thumbnailUrl: string;
  viewCount: string | null;
  hasGlow?: boolean;
  rank: RankData;
  rarity: RarityInfo;
}

export const Altar = ({ id, title, thumbnailUrl, viewCount, hasGlow, rank, rarity }: AltarProps) => {
  const renderTooltip = (props: any) => (
    <Tooltip id={`tooltip-${id}`} {...props}>
      {title}
    </Tooltip>
  );

  // Generate a random animation delay once per component instance
  const animationDelay = React.useMemo(() => `-${Math.random() * 3}s`, []);

  return (
    <Col md={4} lg={3} sm={6} xs={12} className="p-3">
      <OverlayTrigger placement="top" overlay={renderTooltip} delay={{ show: 250, hide: 400 }}>
        <div className="w-100" style={{ cursor: 'pointer' }}>
          {/* --- Box 1: The Egg/Monster --- */}
          <div
            className="text-center"
            style={{
              paddingBottom: '12%', // Pushes the altar down, making the egg sit higher
            }}
          >
            <StyledEgg src={rarity.eggImage} alt="An egg" hasGlow={hasGlow} style={{ animationDelay }} />
          </div>

          {/* --- Box 2: The Altar and its contents --- */}
          <div
            className="position-relative"
            style={{
              marginTop: '-25%', // Pulls altar up under the egg
            }}
          >
            {/* Layer 1: The Video Thumbnail (beneath the altar) */}
            <img
              src={thumbnailUrl}
              alt={title}
              className="position-absolute pe-none"
              style={{
                top: '35.5%',
                left: '13%',
                width: '74%',
                height: '35%',
                objectFit: 'contain',
                zIndex: 1,
              }}
            />

            {/* Layer 2: The Altar Image (with transparent hole) */}
            <AltarImage
              src="/media/assets/altar.png"
              alt="An altar"
              className="w-100 d-block position-relative"
              style={{ zIndex: 2 }}
            />

            {/* Layer 3: The View Count Badge */}
            {viewCount && (
              <div
                className={classNames(
                  'position-absolute start-50 translate-middle-x',
                  'text-white rounded-pill d-flex align-items-center pe-none',
                )}
                style={{
                  bottom: '2%',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  padding: '1px 8px',
                  fontSize: '0.7rem',
                  gap: '6px',
                  zIndex: 4,
                }}
              >
                <FaEye />
                <span>{viewCount}</span>
              </div>
            )}
          </div>
        </div>
      </OverlayTrigger>

      {/* Rank and Rarity Badges */}
      <div className="d-flex justify-content-center w-100" style={{ gap: '6px', marginTop: '8px' }}>
        <div
          className="text-white rounded-pill d-flex align-items-center pe-none"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '1px 8px',
            fontSize: '0.7rem',
          }}
        >
          <span>{`${rank.rank}-Rank`}</span>
        </div>
        <div
          className="text-white rounded-pill d-flex align-items-center pe-none"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '1px 8px',
            fontSize: '0.7rem',
          }}
        >
          <span>{rarity.name}</span>
        </div>
      </div>
    </Col>
  );
};
