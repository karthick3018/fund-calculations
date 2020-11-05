/* eslint-disable quote-props */
module.exports = {
  theme: {
    boxShadow: {
      'calculator': '0px 0px 2px rgba(0, 0, 0, 0.35)',
      'input': '0px 1px 2px rgba(0,0,0,0.1), 0px 0px 1.5px rgba(0,0,0,0.5)'
    },
    height: {
      'md': '610px',
    },
    inset: {
       '16': '16px',
       '25':'25px',
    },
    extend: {
      width: {
        '350': '350px',
        '205':'205px'
      },
      textColor:{
        '595959':'#595959',
        '4E93EE':'#4E93EE',
        '737373':'#737373',
        '181818':'#181818',
        '0FAC85':'#0FAC85',
        '404040':'#404040',
      },
      flex: {
        'one':'1'
      },
      padding:{
        '0.31':'5px',
      }
    },
    
    backgroundColor: theme => ({
      ...theme('colors'),
     'grey':'#FAFAFA',
     'green':'#0fac85',
     'light-grey':'#F2F2F2'
    }),
    fontFamily:{
      'inter':'Inter'
    }
  }
}