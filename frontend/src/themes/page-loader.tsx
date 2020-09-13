import { NProgress } from '@tanem/react-nprogress'
import PropTypes from 'prop-types'
import React, { Fragment, FunctionComponent } from 'react'
import { render } from 'react-dom'

const PageLoader: FunctionComponent = () => {
  return (
    <Fragment>
      <NProgress isAnimating>
        {({ animationDuration, isFinished, progress }) => (
          <div id="nprogress">
            <Container animationDuration={animationDuration} isFinished={isFinished}>
              TEST
              <Bar animationDuration={animationDuration} progress={progress} />
              {/* Initial Page Loader */}
              <div className="base">
                <div className="logo" />
                <div className="spinner">
                  <div className="dot" />
                  <div className="dots">
                    <div />
                    <div />
                    <div />
                  </div>
                </div>
              </div>
              {/* END Initial Page Loader */}
            </Container>
          </div>
        )}
      </NProgress>
    </Fragment>
  )
}

const Bar: FunctionComponent<IBarProps> = ({ progress, animationDuration }) => (
  <div
    style={{
      background: '#29d',
      height: 2,
      left: 0,
      marginLeft: `${(-1 + progress) * 100}%`,
      position: 'fixed',
      top: 0,
      transition: `margin-left ${animationDuration}ms linear`,
      width: '100%',
      zIndex: 1031
    }}
  >
    <div
      style={{
        boxShadow: '0 0 10px #29d, 0 0 5px #29d',
        display: 'block',
        height: '100%',
        opacity: 1,
        position: 'absolute',
        right: 0,
        transform: 'rotate(3deg) translate(0px, -4px)',
        width: 100
      }}
    />
  </div>
)

interface IBarProps {
  animationDuration: number
  progress: number
}

const Container: FunctionComponent<IContainerProps> = ({ children, isFinished, animationDuration }) => (
  <div
    style={{
      opacity: isFinished ? 0 : 1,
      pointerEvents: 'none',
      transition: `opacity ${animationDuration}ms linear`,
      position: 'absolute',
      width: '100%',
      height: '100%',
      'background-color': '#121212',
      'z-index': '9000',
      'backdrop-filter': 'blur(6px)'
    }}
  >
    {children}
  </div>
)

interface IContainerProps {
  animationDuration: number
  isFinished: boolean
}

export default PageLoader
