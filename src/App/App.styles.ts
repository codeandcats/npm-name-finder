import { px } from 'csx';
import { style } from 'typestyle';

export const app = style({
  $debugName: 'app',

  padding: px(50),
  boxSizing: 'border-box',
  textAlign: 'center',
});

export const logo = style({
  $debugName: 'logo',

  width: px(600),
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

export const search = style({
  $debugName: 'search',

  marginTop: px(50),
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center'
});

export const searchBox = style({
  $debugName: 'searchBox',

  borderColor: '#ccc',
  borderWidth: px(1),
  borderStyle: 'solid',
  borderRadius: px(4),
  fontSize: px(20),
  margin: 0,
  padding: px(10),
  width: px(400),
});

export const searchButton = style({
  $debugName: 'searchButton',

  borderWidth: px(1),
  borderStyle: 'solid',
  borderRadius: px(4),
  cursor: 'pointer',
  fontSize: px(20),
  height: px(45),
  margin: 0,
  marginLeft: px(10),
  padding: '5px 10px',
});

export const results = style({
  $debugName: 'results',

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
  width: '100%',
})