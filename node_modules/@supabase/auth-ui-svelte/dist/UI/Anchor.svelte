<script>import { css } from '@stitches/core';
import { generateClassNames } from '@supabase/auth-ui-shared';
const anchorHTMLAttributes = css({
    fontFamily: '$bodyFontFamily',
    fontSize: '$baseBodySize',
    marginBottom: '$anchorBottomMargin',
    color: '$anchorTextColor',
    display: 'block',
    textAlign: 'center',
    textDecoration: 'underline',
    '&:hover': {
        color: '$anchorTextHoverColor'
    }
});
export let href;
export let appearance = {};
$: classNames = generateClassNames('anchor', anchorHTMLAttributes(), appearance);
</script>

<a on:click {href} {...$$restProps} style={appearance?.style?.anchor} class={classNames.join(' ')}>
	<slot />
</a>
