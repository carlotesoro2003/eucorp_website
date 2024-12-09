<script>import { css } from '@stitches/core';
import { generateClassNames } from '@supabase/auth-ui-shared';
const messageDefaultStyles = css({
    fontFamily: '$bodyFontFamily',
    fontSize: '$baseInputSize',
    marginBottom: '$labelBottomMargin',
    display: 'block',
    textAlign: 'center',
    borderRadius: '0.375rem',
    padding: '1.5rem 1rem',
    lineHeight: '1rem',
    variants: {
        color: {
            default: {
                color: '$messageText',
                backgroundColor: '$messageBackground',
                border: '1px solid $messageBorder'
            },
            danger: {
                color: '$messageTextDanger',
                backgroundColor: '$messageBackgroundDanger',
                border: '1px solid $messageBorderDanger'
            }
        }
    }
});
export let color = 'default';
export let appearance = {};
$: classNames = generateClassNames('message', messageDefaultStyles({ color }), appearance);
</script>

<span {...$$restProps} style={appearance?.style?.message} class={classNames.join(' ')}>
	<slot />
</span>
