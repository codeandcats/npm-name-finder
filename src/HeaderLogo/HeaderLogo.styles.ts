import { style, media, keyframes } from 'typestyle';
import { px, percent } from 'csx';

export const container = style(
  {
    $debugName: 'container',

    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    width: percent(100),
  }
);

export const logo = style(
  {
    $debugName: 'logo',

    width: percent(100),
  },
  media(
    { minWidth: px(667) },
    { width: px(560) }
  ),
  media(
    { minWidth: px(992) },
    { width: px(700) }
  )
);

const starburstRotation = keyframes({
  $debugName: 'starburstRotation',

  from: {
    transform: 'rotate(0deg)',
  },
  to: {
    transform: 'rotate(360deg)'
  }
});

export const starburst = style(
  {
    $debugName: 'starburst',

    animationName: starburstRotation,
    animationDuration: '20s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'linear',
    opacity: .1,
    position: 'absolute',
    width: percent(100),
    zIndex: -1,
  },
  media(
    { minWidth: px(667) },
    { width: px(560) }
  ),
  media(
    { minWidth: px(992) },
    { width: px(700) }
  )
);
