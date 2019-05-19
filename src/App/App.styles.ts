import { px, percent } from 'csx';
import { style, media } from 'typestyle';

export const showSearchButtonAtScreenWidth = 450;

export const app = style({
  $debugName: 'app',

  padding: px(50),
  boxSizing: 'border-box',
  textAlign: 'center',
});

export const subtitle = style({
  $debugName: 'subtitle',

  marginTop: px(20)
});

export const perfectText = style({
  $debugName: 'perfectText',

  color: '#500',
  textDecoration: 'line-through',
});

export const availableText = style({
  $debugName: 'availableText',

  color: '#050',
});

export const searchForm = style(
  { $debugName: 'searchForm' },
  media(
    { maxWidth: showSearchButtonAtScreenWidth },
    { width: percent(100) }
  )
);

export const search = style({
  $debugName: 'search',

  marginTop: px(50),
  marginBottom: px(40),
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center'
});

export const searchGroup = style(
  {
    $debugName: 'searchGroup',
  }
);

export const searchButton = style(
  {
    $debugName: 'searchButton',
  },
  media(
    { maxWidth: px(450) },
    { display: 'none' },
  ),
);

export const results = style({
  $debugName: 'results',

  marginBottom: px(75)
});

export const suggestions = style({
  $debugName: 'suggestions',

  marginTop: px(35),

  $nest: {
    '& ul': {
      listStyleType: 'none',
      padding: 0,
    },
    '& li': {
      marginBottom: px(8),
      fontSize: px(25),
    },
  }
});

export const unavailable = style({
  $debugName: 'unavailable',

  color: '#500'
})

export const available = style({
  $debugName: 'available',

  color: '#050'
})

export const spinnerContainer = style({
  $debugName: 'spinnerContainer',

  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  marginTop: px(75),
  marginBottom: px(75),
  width: '100%',
})

export const footer = style({
  fontSize: 'small'
});
