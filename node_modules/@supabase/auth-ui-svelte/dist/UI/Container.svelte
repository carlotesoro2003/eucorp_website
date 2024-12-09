<script>import { css } from '@stitches/core';
import { generateClassNames } from '@supabase/auth-ui-shared';
const containerDefaultStyles = css({
    display: 'flex',
    gap: '4px',
    variants: {
        direction: {
            horizontal: {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(48px, 1fr))'
            },
            vertical: {
                flexDirection: 'column',
                margin: '8px 0'
            }
        },
        gap: {
            small: {
                gap: '4px'
            },
            medium: {
                gap: '8px'
            },
            large: {
                gap: '16px'
            }
        }
    }
});
export let direction = 'horizontal';
export let gap = 'small';
export let appearance = {};
$: classNames = generateClassNames('container', containerDefaultStyles({
    direction,
    gap
}), appearance);
</script>

<div {...$$restProps} style={appearance?.style?.container} class={classNames.join(' ')}>
	<slot />
</div>
