import classNames from 'classnames/bind';
import styles from './MenuDropdown.module.scss'

const cx = classNames.bind(styles)

function MenuDropdown({disable = false, children, width, title = '', maxHeight = 0 }) {
    const classes = cx('wrapper', {
        disable
    })
    
	return (
        <div className={classes} style={{width, maxHeight}}>
            {title && <span className={cx('title')}>{title}</span>}
            { children }
        </div>
    );
}

export default MenuDropdown;
