<script>import { css } from '@stitches/core';
import { generateClassNames } from '@supabase/auth-ui-shared';
const labelDefaultStyles = css({
    fontFamily: '$labelFontFamily',
    fontSize: '$baseLabelSize',
    marginBottom: '$labelBottomMargin',
    color: '$inputLabelText',
    display: 'block'
});
export let appearance = {};
$: classNames = generateClassNames('label', labelDefaultStyles(), appearance);
</script>

<label {...$$restProps} style={appearance?.style?.label} class={classNames.join(' ')}>
	<slot />
</label>
