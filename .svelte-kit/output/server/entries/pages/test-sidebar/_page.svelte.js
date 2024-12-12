import { U as once, A as push, V as spread_attributes, G as bind_props, C as pop, S as copy_payload, T as assign_payload, N as spread_props, R as stringify, O as slot, P as sanitize_props, F as attr, Q as ensure_array_like, L as escape_html, J as store_get, K as unsubscribe_stores } from "../../../chunks/index.js";
import { A as ARROW_LEFT, a as ARROW_RIGHT, b as ARROW_DOWN, c as ARROW_UP, d as box, H as HOME, E as END, i as isBrowser, e as createContext, f as useRefById, g as useId, m as mergeProps, h as getDataOpenClosed, j as getDataDisabled, S as SPACE, k as ENTER, l as getAriaExpanded, n as noop, P as Presence_layer, o as getAriaOrientation, p as getAriaHidden, q as getDataOrientation, r as PAGE_DOWN, s as PAGE_UP, t as isHTMLElement, T as TAB, v as focusFirst, w as isElement, x as afterTick, y as isElementOrSVGElement, z as getAriaDisabled, B as useDialogRoot, F as Floating_layer, C as Popper_layer_force_mount, D as Popper_layer, G as getFloatingContentCSSVars, I as Floating_layer_anchor, J as cn, K as setSidebar, L as Provider, M as SIDEBAR_COOKIE_NAME, N as SIDEBAR_COOKIE_MAX_AGE, O as SIDEBAR_WIDTH, Q as SIDEBAR_WIDTH_ICON, R as useSidebar, U as Button, V as Sheet_content, W as SIDEBAR_WIDTH_MOBILE, X as Sidebar_menu_button, Y as Portal, u as userStore } from "../../../chunks/sheet-content.js";
import "style-to-object";
import "clsx";
import { I as Icon } from "../../../chunks/Icon.js";
import { s as supabase } from "../../../chunks/supabaseClient.js";
import { g as goto } from "../../../chunks/client.js";
import { d as derived } from "../../../chunks/index3.js";
function getElemDirection(elem) {
  const style = window.getComputedStyle(elem);
  const direction = style.getPropertyValue("direction");
  return direction;
}
function getNextKey(dir = "ltr", orientation = "horizontal") {
  return {
    horizontal: dir === "rtl" ? ARROW_LEFT : ARROW_RIGHT,
    vertical: ARROW_DOWN
  }[orientation];
}
function getPrevKey(dir = "ltr", orientation = "horizontal") {
  return {
    horizontal: dir === "rtl" ? ARROW_RIGHT : ARROW_LEFT,
    vertical: ARROW_UP
  }[orientation];
}
function getDirectionalKeys(dir = "ltr", orientation = "horizontal") {
  if (!["ltr", "rtl"].includes(dir))
    dir = "ltr";
  if (!["horizontal", "vertical"].includes(orientation))
    orientation = "horizontal";
  return {
    nextKey: getNextKey(dir, orientation),
    prevKey: getPrevKey(dir, orientation)
  };
}
function useRovingFocus(props) {
  const currentTabStopId = props.currentTabStopId ? props.currentTabStopId : box(null);
  function getCandidateNodes() {
    if (!isBrowser) return [];
    const node = document.getElementById(props.rootNodeId.current);
    if (!node) return [];
    if (props.candidateSelector) {
      const candidates = Array.from(node.querySelectorAll(props.candidateSelector));
      return candidates;
    } else {
      const candidates = Array.from(node.querySelectorAll(`[${props.candidateAttr}]:not([data-disabled])`));
      return candidates;
    }
  }
  function focusFirstCandidate() {
    const items = getCandidateNodes();
    if (!items.length) return;
    items[0]?.focus();
  }
  function handleKeydown(node, e, both = false) {
    const rootNode = document.getElementById(props.rootNodeId.current);
    if (!rootNode || !node) return;
    const items = getCandidateNodes();
    if (!items.length) return;
    const currentIndex = items.indexOf(node);
    const dir = getElemDirection(rootNode);
    const { nextKey, prevKey } = getDirectionalKeys(dir, props.orientation.current);
    const loop = props.loop.current;
    const keyToIndex = {
      [nextKey]: currentIndex + 1,
      [prevKey]: currentIndex - 1,
      [HOME]: 0,
      [END]: items.length - 1
    };
    if (both) {
      const altNextKey = nextKey === ARROW_DOWN ? ARROW_RIGHT : ARROW_DOWN;
      const altPrevKey = prevKey === ARROW_UP ? ARROW_LEFT : ARROW_UP;
      keyToIndex[altNextKey] = currentIndex + 1;
      keyToIndex[altPrevKey] = currentIndex - 1;
    }
    let itemIndex = keyToIndex[e.key];
    if (itemIndex === void 0) return;
    e.preventDefault();
    if (itemIndex < 0 && loop) {
      itemIndex = items.length - 1;
    } else if (itemIndex === items.length && loop) {
      itemIndex = 0;
    }
    const itemToFocus = items[itemIndex];
    if (!itemToFocus) return;
    itemToFocus.focus();
    currentTabStopId.current = itemToFocus.id;
    props.onCandidateFocus?.(itemToFocus);
    return itemToFocus;
  }
  function getTabIndex(node) {
    const items = getCandidateNodes();
    const anyActive = currentTabStopId.current !== null;
    if (node && !anyActive && items[0] === node) {
      currentTabStopId.current = node.id;
      return 0;
    } else if (node?.id === currentTabStopId.current) {
      return 0;
    }
    return -1;
  }
  return {
    setCurrentTabStopId(id) {
      currentTabStopId.current = id;
    },
    getTabIndex,
    handleKeydown,
    focusFirstCandidate,
    currentTabStopId
  };
}
class Readable {
  #current;
  #start;
  constructor(initialValue, start) {
    this.#current = initialValue;
    this.#start = start;
  }
  #subscribers = 0;
  #stop = null;
  get current() {
    if (this.#subscribers === 0) {
      this.#subscribe(false);
      this.#unsubscribe();
    }
    return this.#current;
  }
  #subscribe(inEffect) {
    this.#stop = this.#start(
      (value) => {
        this.#current = value;
      },
      inEffect
    ) ?? null;
  }
  #unsubscribe() {
    if (this.#stop === null) return;
    this.#stop();
    this.#stop = null;
  }
}
const activeElement = new Readable(null, (set, insideEffect) => {
  function update() {
    return;
  }
  if (!insideEffect) return;
  document.addEventListener("focusin", update);
  document.addEventListener("focusout", update);
  return () => {
    document.removeEventListener("focusin", update);
    document.removeEventListener("focusout", update);
  };
});
function isFunction(value) {
  return typeof value === "function";
}
function extract(value, defaultValue) {
  if (isFunction(value)) {
    const getter = value;
    return getter() ?? defaultValue ?? getter();
  }
  return value ?? defaultValue ?? value;
}
class IsFocusWithin {
  #node;
  #target = once(() => extract(this.#node));
  constructor(node) {
    this.#node = node;
  }
  #current = once(() => {
    if (!this.#target() || !activeElement.current) return false;
    return this.#target().contains(activeElement.current);
  });
  get current() {
    return this.#current();
  }
}
const AVATAR_ROOT_ATTR = "data-avatar-root";
const AVATAR_IMAGE_ATTR = "data-avatar-image";
const AVATAR_FALLBACK_ATTR = "data-avatar-fallback";
class AvatarRootState {
  #id;
  #ref;
  delayMs;
  loadingStatus;
  constructor(props) {
    this.delayMs = props.delayMs;
    this.loadingStatus = props.loadingStatus;
    this.#ref = props.ref;
    this.#id = props.id;
    this.loadImage = this.loadImage.bind(this);
    useRefById({ id: this.#id, ref: this.#ref });
  }
  loadImage(src, crossorigin, referrerPolicy) {
    let imageTimerId;
    const image = new Image();
    image.src = src;
    if (crossorigin !== void 0) image.crossOrigin = crossorigin;
    if (referrerPolicy) image.referrerPolicy = referrerPolicy;
    this.loadingStatus.current = "loading";
    image.onload = () => {
      imageTimerId = window.setTimeout(
        () => {
          this.loadingStatus.current = "loaded";
        },
        this.delayMs.current
      );
    };
    image.onerror = () => {
      this.loadingStatus.current = "error";
    };
    return () => {
      window.clearTimeout(imageTimerId);
    };
  }
  #props = once(() => ({
    id: this.#id.current,
    [AVATAR_ROOT_ATTR]: "",
    "data-status": this.loadingStatus.current
  }));
  get props() {
    return this.#props();
  }
}
class AvatarImageState {
  #id;
  #ref;
  #crossOrigin;
  #referrerPolicy;
  #src;
  #root;
  constructor(props, root) {
    this.#root = root;
    this.#src = props.src;
    this.#id = props.id;
    this.#ref = props.ref;
    this.#crossOrigin = props.crossOrigin;
    this.#referrerPolicy = props.referrerPolicy;
    useRefById({ id: this.#id, ref: this.#ref });
  }
  #props = once(() => ({
    id: this.#id.current,
    style: {
      display: this.#root.loadingStatus.current === "loaded" ? "block" : "none"
    },
    "data-status": this.#root.loadingStatus.current,
    [AVATAR_IMAGE_ATTR]: "",
    src: this.#src.current,
    crossorigin: this.#crossOrigin.current,
    referrerpolicy: this.#referrerPolicy.current
  }));
  get props() {
    return this.#props();
  }
}
class AvatarFallbackState {
  #id;
  #ref;
  #root;
  constructor(props, root) {
    this.#root = root;
    this.#id = props.id;
    this.#ref = props.ref;
    useRefById({ id: this.#id, ref: this.#ref });
  }
  #props = once(() => ({
    style: {
      display: this.#root.loadingStatus.current === "loaded" ? "none" : void 0
    },
    "data-status": this.#root.loadingStatus.current,
    [AVATAR_FALLBACK_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
}
const [setAvatarRootContext, getAvatarRootContext] = createContext("Avatar.Root");
function useAvatarRoot(props) {
  return setAvatarRootContext(new AvatarRootState(props));
}
function useAvatarImage(props) {
  const root = getAvatarRootContext();
  return new AvatarImageState(props, root);
}
function useAvatarFallback(props) {
  const root = getAvatarRootContext();
  return new AvatarFallbackState(props, root);
}
function Avatar$1($$payload, $$props) {
  push();
  let {
    delayMs = 0,
    loadingStatus = "loading",
    onLoadingStatusChange,
    child,
    children,
    id = useId(),
    ref = null,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const rootState = useAvatarRoot({
    delayMs: box.with(() => delayMs),
    loadingStatus: box.with(() => loadingStatus, (v) => {
      if (loadingStatus !== v) {
        loadingStatus = v;
        onLoadingStatusChange?.(v);
      }
    }),
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, rootState.props);
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div${spread_attributes({ ...mergedProps })}>`;
    children?.($$payload);
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { loadingStatus, ref });
  pop();
}
function Avatar_image$1($$payload, $$props) {
  push();
  let {
    src,
    child,
    id = useId(),
    ref = null,
    crossorigin = void 0,
    referrerpolicy = void 0,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const imageState = useAvatarImage({
    src: box.with(() => src),
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v),
    crossOrigin: box.with(() => crossorigin),
    referrerPolicy: box.with(() => referrerpolicy)
  });
  const mergedProps = mergeProps(restProps, imageState.props);
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<img${spread_attributes({ ...mergedProps, src })} onload="this.__e=event" onerror="this.__e=event">`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function Avatar_fallback$1($$payload, $$props) {
  push();
  let {
    children,
    child,
    id = useId(),
    ref = null,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const fallbackState = useAvatarFallback({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, fallbackState.props);
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<span${spread_attributes({ ...mergedProps })}>`;
    children?.($$payload);
    $$payload.out += `<!----></span>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function getNextMatch(values, search, currentMatch) {
  const isRepeated = search.length > 1 && Array.from(search).every((char) => char === search[0]);
  const normalizedSearch = isRepeated ? search[0] : search;
  const currentMatchIndex = currentMatch ? values.indexOf(currentMatch) : -1;
  let wrappedValues = wrapArray(values, Math.max(currentMatchIndex, 0));
  const excludeCurrentMatch = normalizedSearch.length === 1;
  if (excludeCurrentMatch)
    wrappedValues = wrappedValues.filter((v) => v !== currentMatch);
  const nextMatch = wrappedValues.find((value) => value?.toLowerCase().startsWith(normalizedSearch.toLowerCase()));
  return nextMatch !== currentMatch ? nextMatch : void 0;
}
function wrapArray(array, startIndex) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}
const COLLAPSIBLE_ROOT_ATTR = "data-collapsible-root";
const COLLAPSIBLE_CONTENT_ATTR = "data-collapsible-content";
const COLLAPSIBLE_TRIGGER_ATTR = "data-collapsible-trigger";
class CollapsibleRootState {
  #id;
  #ref;
  open;
  disabled;
  contentNode = null;
  contentId = void 0;
  constructor(props) {
    this.open = props.open;
    this.disabled = props.disabled;
    this.#id = props.id;
    this.#ref = props.ref;
    this.toggleOpen = this.toggleOpen.bind(this);
    useRefById({ id: this.#id, ref: this.#ref });
  }
  toggleOpen() {
    this.open.current = !this.open.current;
  }
  #props = once(() => ({
    id: this.#id.current,
    "data-state": getDataOpenClosed(this.open.current),
    "data-disabled": getDataDisabled(this.disabled.current),
    [COLLAPSIBLE_ROOT_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
}
class CollapsibleContentState {
  #id;
  #ref;
  root;
  #originalStyles;
  #isMountAnimationPrevented = false;
  #width = 0;
  #height = 0;
  #forceMount;
  #present = once(() => this.#forceMount.current || this.root.open.current);
  get present() {
    return this.#present();
  }
  constructor(props, root) {
    this.root = root;
    this.#isMountAnimationPrevented = root.open.current;
    this.#forceMount = props.forceMount;
    this.#id = props.id;
    this.#ref = props.ref;
    useRefById({
      id: this.#id,
      ref: this.#ref,
      deps: () => this.present,
      onRefChange: (node) => {
        this.root.contentNode = node;
        this.root.contentId = node?.id;
      }
    });
  }
  #snippetProps = once(() => ({ open: this.root.open.current }));
  get snippetProps() {
    return this.#snippetProps();
  }
  #props = once(() => ({
    id: this.#id.current,
    style: {
      "--bits-collapsible-content-height": this.#height ? `${this.#height}px` : void 0,
      "--bits-collapsible-content-width": this.#width ? `${this.#width}px` : void 0
    },
    "data-state": getDataOpenClosed(this.root.open.current),
    "data-disabled": getDataDisabled(this.root.disabled.current),
    [COLLAPSIBLE_CONTENT_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
}
class CollapsibleTriggerState {
  #root;
  #ref;
  #id;
  #disabled;
  #isDisabled = once(() => this.#disabled.current || this.#root.disabled.current);
  constructor(props, root) {
    this.#root = root;
    this.#id = props.id;
    this.#ref = props.ref;
    this.#disabled = props.disabled;
    this.onpointerdown = this.onpointerdown.bind(this);
    this.onpointerup = this.onpointerup.bind(this);
    this.onkeydown = this.onkeydown.bind(this);
    useRefById({ id: this.#id, ref: this.#ref });
  }
  onpointerdown(e) {
    if (this.#isDisabled()) return;
    if (e.pointerType === "touch" || e.button !== 0) return e.preventDefault();
    this.#root.toggleOpen();
  }
  onpointerup(e) {
    if (this.#isDisabled()) return;
    if (e.pointerType === "touch") {
      e.preventDefault();
      this.#root.toggleOpen();
    }
  }
  onkeydown(e) {
    if (this.#isDisabled()) return;
    if (e.key === SPACE || e.key === ENTER) {
      this.#root.toggleOpen();
    }
  }
  #props = once(() => ({
    id: this.#id.current,
    type: "button",
    disabled: this.#isDisabled(),
    "aria-controls": this.#root.contentId,
    "aria-expanded": getAriaExpanded(this.#root.open.current),
    "data-state": getDataOpenClosed(this.#root.open.current),
    "data-disabled": getDataDisabled(this.#isDisabled()),
    [COLLAPSIBLE_TRIGGER_ATTR]: "",
    //
    onpointerdown: this.onpointerdown,
    onpointerup: this.onpointerup,
    onkeydown: this.onkeydown
  }));
  get props() {
    return this.#props();
  }
}
const [
  setCollapsibleRootContext,
  getCollapsibleRootContext
] = createContext("Collapsible.Root");
function useCollapsibleRoot(props) {
  return setCollapsibleRootContext(new CollapsibleRootState(props));
}
function useCollapsibleTrigger(props) {
  const root = getCollapsibleRootContext();
  return new CollapsibleTriggerState(props, root);
}
function useCollapsibleContent(props) {
  const root = getCollapsibleRootContext();
  return new CollapsibleContentState(props, root);
}
function Collapsible($$payload, $$props) {
  push();
  let {
    children,
    child,
    id = useId(),
    ref = null,
    open = false,
    disabled = false,
    controlledOpen = false,
    onOpenChange = noop,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const rootState = useCollapsibleRoot({
    open: box.with(() => open, (v) => {
      if (controlledOpen) {
        onOpenChange(v);
      } else {
        open = v;
        onOpenChange(v);
      }
    }),
    disabled: box.with(() => disabled),
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, rootState.props);
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div${spread_attributes({ ...mergedProps })}>`;
    children?.($$payload);
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref, open });
  pop();
}
function Collapsible_content($$payload, $$props) {
  push();
  let {
    child,
    ref = null,
    forceMount = false,
    children,
    id = useId(),
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const contentState = useCollapsibleContent({
    id: box.with(() => id),
    forceMount: box.with(() => forceMount),
    ref: box.with(() => ref, (v) => ref = v)
  });
  {
    let presence = function($$payload2, { present }) {
      const mergedProps = mergeProps(restProps, contentState.props, {
        hidden: forceMount ? void 0 : !present.current
      });
      if (child) {
        $$payload2.out += "<!--[-->";
        child($$payload2, {
          ...contentState.snippetProps,
          props: mergedProps
        });
        $$payload2.out += `<!---->`;
      } else {
        $$payload2.out += "<!--[!-->";
        $$payload2.out += `<div${spread_attributes({ ...mergedProps })}>`;
        children?.($$payload2);
        $$payload2.out += `<!----></div>`;
      }
      $$payload2.out += `<!--]-->`;
    };
    Presence_layer($$payload, {
      forceMount: true,
      present: contentState.present,
      id,
      presence,
      $$slots: { presence: true }
    });
  }
  bind_props($$props, { ref });
  pop();
}
function Collapsible_trigger($$payload, $$props) {
  push();
  let {
    children,
    child,
    ref = null,
    id = useId(),
    disabled = false,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const triggerState = useCollapsibleTrigger({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v),
    disabled: box.with(() => disabled)
  });
  const mergedProps = mergeProps(restProps, triggerState.props);
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<button${spread_attributes({ ...mergedProps })}>`;
    children?.($$payload);
    $$payload.out += `<!----></button>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function boxAutoReset(defaultValue, afterMs = 1e4) {
  let timeout = null;
  let value = defaultValue;
  function resetAfter() {
    return setTimeout(
      () => {
        value = defaultValue;
      },
      afterMs
    );
  }
  return box.with(() => value, (v) => {
    value = v;
    if (timeout) clearTimeout(timeout);
    timeout = resetAfter();
  });
}
function useDOMTypeahead(opts) {
  const search = boxAutoReset("", 1e3);
  const onMatch = (node) => node.focus();
  const getCurrentItem = () => document.activeElement;
  function handleTypeaheadSearch(key, candidates) {
    if (!candidates.length) return;
    search.current = search.current + key;
    const currentItem = getCurrentItem();
    const currentMatch = candidates.find((item) => item === currentItem)?.textContent?.trim() ?? "";
    const values = candidates.map((item) => item.textContent?.trim() ?? "");
    const nextMatch = getNextMatch(values, search.current, currentMatch);
    const newItem = candidates.find((item) => item.textContent?.trim() === nextMatch);
    if (newItem) {
      onMatch(newItem);
    }
    return newItem;
  }
  function resetTypeahead() {
    search.current = "";
  }
  return {
    search,
    handleTypeaheadSearch,
    resetTypeahead
  };
}
const ROOT_ATTR = "data-separator-root";
class SeparatorRootState {
  #id;
  #ref;
  #orientation;
  #decorative;
  constructor(props) {
    this.#orientation = props.orientation;
    this.#decorative = props.decorative;
    this.#id = props.id;
    this.#ref = props.ref;
    useRefById({ id: this.#id, ref: this.#ref });
  }
  #props = once(() => ({
    id: this.#id.current,
    role: this.#decorative.current ? "none" : "separator",
    "aria-orientation": getAriaOrientation(this.#orientation.current),
    "aria-hidden": getAriaHidden(this.#decorative.current),
    "data-orientation": getDataOrientation(this.#orientation.current),
    [ROOT_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
}
function useSeparatorRoot(props) {
  return new SeparatorRootState(props);
}
function Separator$1($$payload, $$props) {
  push();
  let {
    id = useId(),
    ref = null,
    child,
    children,
    decorative = false,
    orientation = "horizontal",
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const rootState = useSeparatorRoot({
    ref: box.with(() => ref, (v) => ref = v),
    id: box.with(() => id),
    decorative: box.with(() => decorative),
    orientation: box.with(() => orientation)
  });
  const mergedProps = mergeProps(restProps, rootState.props);
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div${spread_attributes({ ...mergedProps })}>`;
    children?.($$payload);
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function Mounted($$payload, $$props) {
  push();
  let { isMounted = false, onMountedChange = noop } = $$props;
  bind_props($$props, { isMounted });
  pop();
}
const SELECTION_KEYS = [ENTER, SPACE];
const FIRST_KEYS = [ARROW_DOWN, PAGE_UP, HOME];
const LAST_KEYS = [ARROW_UP, PAGE_DOWN, END];
const FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
function isMouseEvent(event) {
  return event.pointerType === "mouse";
}
function pointInPolygon(point, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;
    const intersect = yi > point.y !== yj > point.y && point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi;
    if (intersect)
      inside = !inside;
  }
  return inside;
}
function isPointerInGraceArea(e, area) {
  if (!area)
    return false;
  return pointInPolygon({ x: e.clientX, y: e.clientY }, area);
}
const [setMenuRootContext, getMenuRootContext] = createContext("Menu.Root");
const [setMenuMenuContext, getMenuMenuContext] = createContext(["Menu.Root", "Menu.Sub"], "MenuContext");
const [setMenuContentContext, getMenuContentContext] = createContext("Menu.Content");
const [setMenuGroupContext, getMenuGroupContext] = createContext("Menu.Group");
createContext("Menu.RadioGroup");
class MenuRootState {
  onClose;
  variant;
  isUsingKeyboard = box(false);
  dir;
  constructor(props) {
    this.onClose = props.onClose;
    this.dir = props.dir;
    this.variant = props.variant;
  }
  getAttr(name) {
    return `data-${this.variant.current}-${name}`;
  }
}
class MenuMenuState {
  root;
  open;
  contentId = box.with(() => "");
  contentNode = null;
  triggerNode = null;
  parentMenu;
  constructor(props, root, parentMenu) {
    this.root = root;
    this.open = props.open;
    this.parentMenu = parentMenu;
  }
  toggleOpen() {
    this.open.current = !this.open.current;
  }
  onOpen() {
    this.open.current = true;
  }
  onClose() {
    this.open.current = false;
  }
}
class MenuContentState {
  #id;
  contentRef;
  parentMenu;
  search = "";
  #loop;
  #timer = 0;
  pointerGraceTimer = 0;
  #pointerGraceIntent = null;
  #pointerDir = "right";
  #lastPointerX = 0;
  #handleTypeaheadSearch;
  rovingFocusGroup;
  isMounted;
  isFocusWithin = new IsFocusWithin(() => this.parentMenu.contentNode ?? void 0);
  constructor(props, parentMenu) {
    this.#id = props.id;
    this.#loop = props.loop;
    this.parentMenu = parentMenu;
    this.parentMenu.contentId = props.id;
    this.contentRef = props.ref;
    this.isMounted = props.isMounted;
    this.onkeydown = this.onkeydown.bind(this);
    this.onblur = this.onblur.bind(this);
    this.onpointermove = this.onpointermove.bind(this);
    this.onfocus = this.onfocus.bind(this);
    this.handleInteractOutside = this.handleInteractOutside.bind(this);
    useRefById({
      id: this.#id,
      ref: this.contentRef,
      deps: () => this.parentMenu.open.current,
      onRefChange: (node) => {
        if (this.parentMenu.contentNode !== node) {
          this.parentMenu.contentNode = node;
        }
      }
    });
    this.#handleTypeaheadSearch = useDOMTypeahead().handleTypeaheadSearch;
    this.rovingFocusGroup = useRovingFocus({
      rootNodeId: this.parentMenu.contentId,
      candidateAttr: this.parentMenu.root.getAttr("item"),
      loop: this.#loop,
      orientation: box.with(() => "vertical")
    });
  }
  #getCandidateNodes() {
    const node = this.parentMenu.contentNode;
    if (!node) return [];
    const candidates = Array.from(node.querySelectorAll(`[${this.parentMenu.root.getAttr("item")}]:not([data-disabled])`));
    return candidates;
  }
  #isPointerMovingToSubmenu(e) {
    const isMovingTowards = this.#pointerDir === this.#pointerGraceIntent?.side;
    return isMovingTowards && isPointerInGraceArea(e, this.#pointerGraceIntent?.area);
  }
  onPointerGraceIntentChange(intent) {
    this.#pointerGraceIntent = intent;
  }
  onkeydown(e) {
    if (e.defaultPrevented) return;
    const target = e.target;
    const currentTarget = e.currentTarget;
    if (!isHTMLElement(target) || !isHTMLElement(currentTarget)) return;
    const isKeydownInside = target.closest(`[${this.parentMenu.root.getAttr("content")}]`)?.id === this.parentMenu.contentId.current;
    const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
    const isCharacterKey = e.key.length === 1;
    const kbdFocusedEl = this.rovingFocusGroup.handleKeydown(target, e);
    if (kbdFocusedEl) return;
    if (e.code === "Space") return;
    const candidateNodes = this.#getCandidateNodes();
    if (isKeydownInside) {
      if (e.key === TAB) e.preventDefault();
      if (!isModifierKey && isCharacterKey) {
        this.#handleTypeaheadSearch(e.key, candidateNodes);
      }
    }
    if (e.target?.id !== this.parentMenu.contentId.current) return;
    if (!FIRST_LAST_KEYS.includes(e.key)) return;
    e.preventDefault();
    if (LAST_KEYS.includes(e.key)) {
      candidateNodes.reverse();
    }
    focusFirst(candidateNodes);
  }
  onblur(e) {
    if (!isElement(e.currentTarget)) return;
    if (!isElement(e.target)) return;
    if (!e.currentTarget.contains?.(e.target)) {
      window.clearTimeout(this.#timer);
      this.search = "";
    }
  }
  onfocus(_) {
    if (!this.parentMenu.root.isUsingKeyboard.current) return;
    afterTick(() => this.rovingFocusGroup.focusFirstCandidate());
  }
  onpointermove(e) {
    if (!isMouseEvent(e)) return;
    const target = e.target;
    if (!isElement(target)) return;
    const pointerXHasChanged = this.#lastPointerX !== e.clientX;
    const currentTarget = e.currentTarget;
    if (!isElement(currentTarget)) return;
    if (currentTarget.contains(target) && pointerXHasChanged) {
      const newDir = e.clientX > this.#lastPointerX ? "right" : "left";
      this.#pointerDir = newDir;
      this.#lastPointerX = e.clientX;
    }
  }
  onItemEnter(e) {
    if (this.#isPointerMovingToSubmenu(e)) return true;
    return false;
  }
  onItemLeave(e) {
    if (this.#isPointerMovingToSubmenu(e)) return;
    const contentNode = this.parentMenu.contentNode;
    contentNode?.focus();
    this.rovingFocusGroup.setCurrentTabStopId("");
  }
  onTriggerLeave(e) {
    if (this.#isPointerMovingToSubmenu(e)) return true;
    return false;
  }
  onOpenAutoFocus = (e) => {
    if (e.defaultPrevented) return;
    e.preventDefault();
    const contentNode = this.parentMenu.contentNode;
    contentNode?.focus();
  };
  handleInteractOutside(e) {
    if (!isElementOrSVGElement(e.target)) return;
    const triggerId = this.parentMenu.triggerNode?.id;
    if (e.target.id === triggerId) {
      e.preventDefault();
      return;
    }
    if (e.target.closest(`#${triggerId}`)) {
      e.preventDefault();
    }
  }
  #snippetProps = once(() => ({ open: this.parentMenu.open.current }));
  get snippetProps() {
    return this.#snippetProps();
  }
  #props = once(() => ({
    id: this.#id.current,
    role: "menu",
    "aria-orientation": getAriaOrientation("vertical"),
    [this.parentMenu.root.getAttr("content")]: "",
    "data-state": getDataOpenClosed(this.parentMenu.open.current),
    onkeydown: this.onkeydown,
    onblur: this.onblur,
    onpointermove: this.onpointermove,
    onfocus: this.onfocus,
    dir: this.parentMenu.root.dir.current,
    style: { pointerEvents: "auto" }
  }));
  get props() {
    return this.#props();
  }
}
class MenuItemSharedState {
  content;
  ref;
  id;
  disabled;
  #isFocused = false;
  constructor(props, content) {
    this.content = content;
    this.id = props.id;
    this.disabled = props.disabled;
    this.ref = props.ref;
    this.onpointermove = this.onpointermove.bind(this);
    this.onpointerleave = this.onpointerleave.bind(this);
    this.onfocus = this.onfocus.bind(this);
    this.onblur = this.onblur.bind(this);
    useRefById({
      id: this.id,
      ref: this.ref,
      deps: () => this.content.isMounted.current
    });
  }
  onpointermove(e) {
    if (e.defaultPrevented) return;
    if (!isMouseEvent(e)) return;
    if (this.disabled.current) {
      this.content.onItemLeave(e);
    } else {
      const defaultPrevented = this.content.onItemEnter(e);
      if (defaultPrevented) return;
      const item = e.currentTarget;
      if (!isHTMLElement(item)) return;
      item.focus();
    }
  }
  onpointerleave(e) {
    afterTick(() => {
      if (e.defaultPrevented) return;
      if (!isMouseEvent(e)) return;
      this.content.onItemLeave(e);
    });
  }
  onfocus(e) {
    afterTick(() => {
      if (e.defaultPrevented || this.disabled.current) return;
      this.#isFocused = true;
    });
  }
  onblur(e) {
    afterTick(() => {
      if (e.defaultPrevented) return;
      this.#isFocused = false;
    });
  }
  #props = once(() => ({
    id: this.id.current,
    tabindex: -1,
    role: "menuitem",
    "aria-disabled": getAriaDisabled(this.disabled.current),
    "data-disabled": getDataDisabled(this.disabled.current),
    "data-highlighted": this.#isFocused ? "" : void 0,
    [this.content.parentMenu.root.getAttr("item")]: "",
    //
    onpointermove: this.onpointermove,
    onpointerleave: this.onpointerleave,
    onfocus: this.onfocus,
    onblur: this.onblur
  }));
  get props() {
    return this.#props();
  }
}
class MenuItemState {
  #item;
  #onSelect;
  #closeOnSelect;
  #isPointerDown = false;
  root;
  constructor(props, item) {
    this.#item = item;
    this.root = item.content.parentMenu.root;
    this.#onSelect = props.onSelect;
    this.#closeOnSelect = props.closeOnSelect;
    this.onkeydown = this.onkeydown.bind(this);
    this.onclick = this.onclick.bind(this);
    this.onpointerdown = this.onpointerdown.bind(this);
    this.onpointerup = this.onpointerup.bind(this);
  }
  #handleSelect() {
    if (this.#item.disabled.current) return;
    const selectEvent = new CustomEvent("menuitemselect", { bubbles: true, cancelable: true });
    this.#onSelect.current(selectEvent);
    afterTick(() => {
      if (selectEvent.defaultPrevented) {
        this.#item.content.parentMenu.root.isUsingKeyboard.current = false;
        return;
      }
      if (this.#closeOnSelect.current) {
        this.#item.content.parentMenu.root.onClose();
      }
    });
  }
  onkeydown(e) {
    const isTypingAhead = this.#item.content.search !== "";
    if (this.#item.disabled.current || isTypingAhead && e.key === SPACE) return;
    if (SELECTION_KEYS.includes(e.key)) {
      if (!isHTMLElement(e.currentTarget)) return;
      e.currentTarget.click();
      e.preventDefault();
    }
  }
  onclick(_) {
    if (this.#item.disabled.current) return;
    this.#handleSelect();
  }
  onpointerup(e) {
    if (e.defaultPrevented) return;
    if (!this.#isPointerDown) {
      if (!isHTMLElement(e.currentTarget)) return;
      e.currentTarget?.click();
    }
  }
  onpointerdown(_) {
    this.#isPointerDown = true;
  }
  #props = once(() => mergeProps(this.#item.props, {
    onclick: this.onclick,
    onpointerdown: this.onpointerdown,
    onpointerup: this.onpointerup,
    onkeydown: this.onkeydown
  }));
  get props() {
    return this.#props();
  }
}
class MenuGroupState {
  #id;
  #ref;
  groupHeadingId = void 0;
  root;
  constructor(props, root) {
    this.#id = props.id;
    this.#ref = props.ref;
    this.root = root;
    useRefById({ id: this.#id, ref: this.#ref });
  }
  #props = once(() => ({
    id: this.#id.current,
    role: "group",
    "aria-labelledby": this.groupHeadingId,
    [this.root.getAttr("group")]: ""
  }));
  get props() {
    return this.#props();
  }
}
class MenuSeparatorState {
  #id;
  #ref;
  #root;
  constructor(props, root) {
    this.#id = props.id;
    this.#ref = props.ref;
    this.#root = root;
    useRefById({ id: this.#id, ref: this.#ref });
  }
  #props = once(() => ({
    id: this.#id.current,
    role: "group",
    [this.#root.getAttr("separator")]: ""
  }));
  get props() {
    return this.#props();
  }
}
class DropdownMenuTriggerState {
  #id;
  #ref;
  #parentMenu;
  #disabled;
  constructor(props, parentMenu) {
    this.#ref = props.ref;
    this.#id = props.id;
    this.#parentMenu = parentMenu;
    this.#disabled = props.disabled;
    this.onpointerdown = this.onpointerdown.bind(this);
    this.onpointerup = this.onpointerup.bind(this);
    this.onkeydown = this.onkeydown.bind(this);
    useRefById({
      id: this.#id,
      ref: this.#ref,
      onRefChange: (ref) => {
        this.#parentMenu.triggerNode = ref;
      }
    });
  }
  onpointerdown(e) {
    if (this.#disabled.current) return;
    if (e.pointerType === "touch") return e.preventDefault();
    if (e.button === 0 && e.ctrlKey === false) {
      this.#parentMenu.toggleOpen();
      if (!this.#parentMenu.open.current) e.preventDefault();
    }
  }
  onpointerup(e) {
    if (this.#disabled.current) return;
    if (e.pointerType === "touch") {
      e.preventDefault();
      this.#parentMenu.toggleOpen();
    }
  }
  onkeydown(e) {
    if (this.#disabled.current) return;
    if (e.key === SPACE || e.key === ENTER) {
      this.#parentMenu.toggleOpen();
      e.preventDefault();
      return;
    }
    if (e.key === ARROW_DOWN) {
      this.#parentMenu.onOpen();
      e.preventDefault();
    }
  }
  #ariaControls = once(() => {
    if (this.#parentMenu.open.current && this.#parentMenu.contentId.current) return this.#parentMenu.contentId.current;
    return void 0;
  });
  #props = once(() => ({
    id: this.#id.current,
    disabled: this.#disabled.current,
    "aria-haspopup": "menu",
    "aria-expanded": getAriaExpanded(this.#parentMenu.open.current),
    "aria-controls": this.#ariaControls(),
    "data-disabled": getDataDisabled(this.#disabled.current),
    "data-state": getDataOpenClosed(this.#parentMenu.open.current),
    [this.#parentMenu.root.getAttr("trigger")]: "",
    //
    onpointerdown: this.onpointerdown,
    onpointerup: this.onpointerup,
    onkeydown: this.onkeydown
  }));
  get props() {
    return this.#props();
  }
}
function useMenuRoot(props) {
  return setMenuRootContext(new MenuRootState(props));
}
function useMenuMenu(root, props) {
  const menu = new MenuMenuState(props, root);
  return setMenuMenuContext(menu);
}
function useMenuDropdownTrigger(props) {
  const menu = getMenuMenuContext();
  return new DropdownMenuTriggerState(props, menu);
}
function useMenuContent(props) {
  const menu = getMenuMenuContext();
  return setMenuContentContext(new MenuContentState(props, menu));
}
function useMenuItem(props) {
  const content = getMenuContentContext();
  const item = new MenuItemSharedState(props, content);
  return new MenuItemState(props, item);
}
function useMenuGroup(props) {
  const root = getMenuRootContext();
  return setMenuGroupContext(new MenuGroupState(props, root));
}
function useMenuSeparator(props) {
  const root = getMenuRootContext();
  return new MenuSeparatorState(props, root);
}
function Menu_item($$payload, $$props) {
  push();
  let {
    child,
    children,
    ref = null,
    id = useId(),
    disabled = false,
    onSelect = noop,
    closeOnSelect = true,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const itemState = useMenuItem({
    id: box.with(() => id),
    disabled: box.with(() => disabled),
    onSelect: box.with(() => onSelect),
    ref: box.with(() => ref, (v) => ref = v),
    closeOnSelect: box.with(() => closeOnSelect)
  });
  const mergedProps = mergeProps(restProps, itemState.props);
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div${spread_attributes({ ...mergedProps })}>`;
    children?.($$payload);
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function Menu_group($$payload, $$props) {
  push();
  let {
    children,
    child,
    ref = null,
    id = useId(),
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const groupState = useMenuGroup({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, groupState.props);
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div${spread_attributes({ ...mergedProps })}>`;
    children?.($$payload);
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function Menu_separator($$payload, $$props) {
  push();
  let {
    ref = null,
    id = useId(),
    child,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const separatorState = useMenuSeparator({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, separatorState.props);
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div${spread_attributes({ ...mergedProps })}>`;
    children?.($$payload);
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function Dialog($$payload, $$props) {
  push();
  let {
    open = false,
    onOpenChange = noop,
    controlledOpen = false,
    children
  } = $$props;
  useDialogRoot({
    variant: box.with(() => "dialog"),
    open: box.with(() => open, (v) => {
      if (controlledOpen) {
        onOpenChange(v);
      } else {
        open = v;
        onOpenChange(v);
      }
    })
  });
  children?.($$payload);
  $$payload.out += `<!---->`;
  bind_props($$props, { open });
  pop();
}
function Menu($$payload, $$props) {
  push();
  let {
    open = false,
    dir = "ltr",
    onOpenChange = noop,
    controlledOpen = false,
    _internal_variant: variant = "dropdown-menu",
    children
  } = $$props;
  const root = useMenuRoot({
    variant: box.with(() => variant),
    dir: box.with(() => dir),
    onClose: () => {
      if (controlledOpen) {
        onOpenChange(false);
      } else {
        open = false;
        onOpenChange?.(false);
      }
    }
  });
  useMenuMenu(root, {
    open: box.with(() => open, (v) => {
      if (controlledOpen) {
        onOpenChange(v);
      } else {
        open = v;
        onOpenChange(v);
      }
    })
  });
  Floating_layer($$payload, {
    children: ($$payload2) => {
      children?.($$payload2);
      $$payload2.out += `<!---->`;
    },
    $$slots: { default: true }
  });
  bind_props($$props, { open });
  pop();
}
function Dropdown_menu_content$1($$payload, $$props) {
  push();
  let {
    id = useId(),
    child,
    children,
    ref = null,
    loop = true,
    onInteractOutside = noop,
    onEscapeKeydown = noop,
    forceMount = false,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let isMounted = false;
  const contentState = useMenuContent({
    id: box.with(() => id),
    loop: box.with(() => loop),
    ref: box.with(() => ref, (v) => ref = v),
    isMounted: box.with(() => isMounted)
  });
  const mergedProps = mergeProps(restProps, contentState.props);
  function handleInteractOutside(e) {
    contentState.handleInteractOutside(e);
    if (e.defaultPrevented) return;
    onInteractOutside(e);
    if (e.defaultPrevented) return;
    contentState.parentMenu.onClose();
  }
  function handleEscapeKeydown(e) {
    onEscapeKeydown(e);
    if (e.defaultPrevented) return;
    contentState.parentMenu.onClose();
  }
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    if (forceMount) {
      $$payload2.out += "<!--[-->";
      {
        let popper = function($$payload3, { props }) {
          const finalProps = mergeProps(props, {
            style: getFloatingContentCSSVars("dropdown-menu")
          });
          if (child) {
            $$payload3.out += "<!--[-->";
            child($$payload3, {
              props: finalProps,
              ...contentState.snippetProps
            });
            $$payload3.out += `<!---->`;
          } else {
            $$payload3.out += "<!--[!-->";
            $$payload3.out += `<div${spread_attributes({ ...finalProps })}>`;
            children?.($$payload3);
            $$payload3.out += `<!----></div>`;
          }
          $$payload3.out += `<!--]--> `;
          Mounted($$payload3, {
            get isMounted() {
              return isMounted;
            },
            set isMounted($$value) {
              isMounted = $$value;
              $$settled = false;
            }
          });
          $$payload3.out += `<!---->`;
        };
        Popper_layer_force_mount($$payload2, spread_props([
          mergedProps,
          {
            enabled: contentState.parentMenu.open.current,
            onInteractOutside: handleInteractOutside,
            onEscapeKeydown: handleEscapeKeydown,
            trapFocus: true,
            loop,
            forceMount: true,
            id,
            popper,
            $$slots: { popper: true }
          }
        ]));
      }
    } else {
      $$payload2.out += "<!--[!-->";
      if (!forceMount) {
        $$payload2.out += "<!--[-->";
        {
          let popper = function($$payload3, { props }) {
            const finalProps = mergeProps(props, {
              style: getFloatingContentCSSVars("dropdown-menu")
            });
            if (child) {
              $$payload3.out += "<!--[-->";
              child($$payload3, {
                props: finalProps,
                ...contentState.snippetProps
              });
              $$payload3.out += `<!---->`;
            } else {
              $$payload3.out += "<!--[!-->";
              $$payload3.out += `<div${spread_attributes({ ...finalProps })}>`;
              children?.($$payload3);
              $$payload3.out += `<!----></div>`;
            }
            $$payload3.out += `<!--]--> `;
            Mounted($$payload3, {
              get isMounted() {
                return isMounted;
              },
              set isMounted($$value) {
                isMounted = $$value;
                $$settled = false;
              }
            });
            $$payload3.out += `<!---->`;
          };
          Popper_layer($$payload2, spread_props([
            mergedProps,
            {
              present: contentState.parentMenu.open.current,
              onInteractOutside: handleInteractOutside,
              onEscapeKeydown: handleEscapeKeydown,
              trapFocus: true,
              loop,
              forceMount: false,
              id,
              popper,
              $$slots: { popper: true }
            }
          ]));
        }
      } else {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]-->`;
    }
    $$payload2.out += `<!--]-->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
function Menu_trigger($$payload, $$props) {
  push();
  let {
    id = useId(),
    ref = null,
    child,
    children,
    disabled = false,
    type = "button",
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const triggerState = useMenuDropdownTrigger({
    id: box.with(() => id),
    disabled: box.with(() => disabled ?? false),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, triggerState.props, { type });
  Floating_layer_anchor($$payload, {
    id,
    children: ($$payload2) => {
      if (child) {
        $$payload2.out += "<!--[-->";
        child($$payload2, { props: mergedProps });
        $$payload2.out += `<!---->`;
      } else {
        $$payload2.out += "<!--[!-->";
        $$payload2.out += `<button${spread_attributes({ ...mergedProps })}>`;
        children?.($$payload2);
        $$payload2.out += `<!----></button>`;
      }
      $$payload2.out += `<!--]-->`;
    },
    $$slots: { default: true }
  });
  bind_props($$props, { ref });
  pop();
}
const Root$2 = Collapsible;
const Trigger$1 = Collapsible_trigger;
const Content = Collapsible_content;
function Sidebar_content($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<div${spread_attributes({
    "data-sidebar": "content",
    class: cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden", className),
    ...restProps
  })}>`;
  children?.($$payload);
  $$payload.out += `<!----></div>`;
  bind_props($$props, { ref });
  pop();
}
function Sidebar_footer($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<div${spread_attributes({
    "data-sidebar": "footer",
    class: cn("flex flex-col gap-2 p-2", className),
    ...restProps
  })}>`;
  children?.($$payload);
  $$payload.out += `<!----></div>`;
  bind_props($$props, { ref });
  pop();
}
function Sidebar_group_label($$payload, $$props) {
  push();
  let {
    ref = null,
    children,
    child,
    class: className,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const mergedProps = {
    class: cn("text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-none transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0", "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0", className),
    "data-sidebar": "group-label",
    ...restProps
  };
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div${spread_attributes({ ...mergedProps })}>`;
    children?.($$payload);
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function Sidebar_group($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<div${spread_attributes({
    "data-sidebar": "group",
    class: cn("relative flex w-full min-w-0 flex-col p-2", className),
    ...restProps
  })}>`;
  children?.($$payload);
  $$payload.out += `<!----></div>`;
  bind_props($$props, { ref });
  pop();
}
function Sidebar_header($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<div${spread_attributes({
    "data-sidebar": "header",
    class: cn("flex flex-col gap-2 p-2", className),
    ...restProps
  })}>`;
  children?.($$payload);
  $$payload.out += `<!----></div>`;
  bind_props($$props, { ref });
  pop();
}
function Sidebar_inset($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<main${spread_attributes({
    class: cn("bg-background relative flex min-h-svh flex-1 flex-col", "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow", className),
    ...restProps
  })}>`;
  children?.($$payload);
  $$payload.out += `<!----></main>`;
  bind_props($$props, { ref });
  pop();
}
function Sidebar_menu_item($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<li${spread_attributes({
    "data-sidebar": "menu-item",
    class: cn("group/menu-item relative", className),
    ...restProps
  })}>`;
  children?.($$payload);
  $$payload.out += `<!----></li>`;
  bind_props($$props, { ref });
  pop();
}
function Sidebar_menu_sub_button($$payload, $$props) {
  push();
  let {
    ref = null,
    children,
    child,
    class: className,
    size = "md",
    isActive,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const mergedProps = {
    class: cn("text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0", "data-[active=true]:bg-sidebar-accent data-[active=true]:text-primary", size === "sm" && "text-xs", size === "md" && "text-sm", "group-data-[collapsible=icon]:hidden", className),
    "data-sidebar": "menu-sub-button",
    "data-size": size,
    "data-active": isActive,
    ...restProps
  };
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<a${spread_attributes({ ...mergedProps })}>`;
    children?.($$payload);
    $$payload.out += `<!----></a>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function Sidebar_menu_sub_item($$payload, $$props) {
  push();
  let {
    ref = null,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<li${spread_attributes({ "data-sidebar": "menu-sub-item", ...restProps })}>`;
  children?.($$payload);
  $$payload.out += `<!----></li>`;
  bind_props($$props, { ref });
  pop();
}
function Sidebar_menu_sub($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<ul${spread_attributes({
    "data-sidebar": "menu-sub",
    class: cn("border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5", "group-data-[collapsible=icon]:hidden", className),
    ...restProps
  })}>`;
  children?.($$payload);
  $$payload.out += `<!----></ul>`;
  bind_props($$props, { ref });
  pop();
}
function Sidebar_menu($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<ul${spread_attributes({
    "data-sidebar": "menu",
    class: cn("flex w-full min-w-0 flex-col gap-1", className),
    ...restProps
  })}>`;
  children?.($$payload);
  $$payload.out += `<!----></ul>`;
  bind_props($$props, { ref });
  pop();
}
function Sidebar_provider($$payload, $$props) {
  push();
  let {
    ref = null,
    open = true,
    onOpenChange = () => {
    },
    controlledOpen = false,
    class: className,
    style,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  setSidebar({
    open: () => open,
    setOpen: (value) => {
      if (controlledOpen) {
        onOpenChange(value);
      } else {
        open = value;
        onOpenChange(value);
      }
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${open}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    }
  });
  $$payload.out += `<!---->`;
  Provider($$payload, {
    delayDuration: 0,
    children: ($$payload2) => {
      $$payload2.out += `<div${spread_attributes({
        style: `--sidebar-width: ${stringify(SIDEBAR_WIDTH)}; --sidebar-width-icon: ${stringify(SIDEBAR_WIDTH_ICON)}; ${stringify(style)}`,
        class: cn("group/sidebar-wrapper has-[[data-variant=inset]]:bg-sidebar flex min-h-svh w-full", className),
        ...restProps
      })}>`;
      children?.($$payload2);
      $$payload2.out += `<!----></div>`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!---->`;
  bind_props($$props, { ref, open });
  pop();
}
function Sidebar_rail($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  useSidebar();
  $$payload.out += `<button${spread_attributes({
    "data-sidebar": "rail",
    "aria-label": "Toggle Sidebar",
    tabindex: -1,
    title: "Toggle Sidebar",
    class: cn("hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex", "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize", "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize", "group-data-[collapsible=offcanvas]:hover:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full", "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2", "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2", className),
    ...restProps
  })}>`;
  children?.($$payload);
  $$payload.out += `<!----></button>`;
  bind_props($$props, { ref });
  pop();
}
function Separator($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    orientation = "horizontal",
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Separator$1($$payload2, spread_props([
      {
        get ref() {
          return ref;
        },
        set ref($$value) {
          ref = $$value;
          $$settled = false;
        },
        class: cn("bg-border shrink-0", orientation === "horizontal" ? "h-[1px] w-full" : "min-h-full w-[1px]", className),
        orientation
      },
      restProps
    ]));
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
function Panel_left($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "rect",
      {
        "width": "18",
        "height": "18",
        "x": "3",
        "y": "3",
        "rx": "2"
      }
    ],
    ["path", { "d": "M9 3v18" }]
  ];
  Icon($$payload, spread_props([
    { name: "panel-left" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Sidebar_trigger($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    onclick,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const sidebar = useSidebar();
  Button($$payload, spread_props([
    {
      type: "button",
      onclick: (e) => {
        onclick?.(e);
        sidebar.toggle();
      },
      "data-sidebar": "trigger",
      variant: "ghost",
      size: "icon",
      class: cn("h-7 w-7", className)
    },
    restProps,
    {
      children: ($$payload2) => {
        Panel_left($$payload2, { color: "#e21d48" });
        $$payload2.out += `<!----> <span class="sr-only">Toggle Sidebar</span>`;
      },
      $$slots: { default: true }
    }
  ]));
  bind_props($$props, { ref });
  pop();
}
const Root$1 = Dialog;
function Sidebar($$payload, $$props) {
  push();
  let {
    ref = null,
    side = "left",
    variant = "sidebar",
    collapsible = "offcanvas",
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const sidebar = useSidebar();
  if (collapsible === "none") {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div${spread_attributes({
      class: cn("bg-sidebar text-sidebar-foreground flex h-full w-[--sidebar-width] flex-col", className),
      ...restProps
    })}>`;
    children?.($$payload);
    $$payload.out += `<!----></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    if (sidebar.isMobile) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<!---->`;
      Root$1($$payload, spread_props([
        {
          controlledOpen: true,
          open: sidebar.openMobile,
          onOpenChange: sidebar.setOpenMobile
        },
        restProps,
        {
          children: ($$payload2) => {
            $$payload2.out += `<!---->`;
            Sheet_content($$payload2, {
              "data-sidebar": "sidebar",
              "data-mobile": "true",
              class: "bg-sidebar text-sidebar-foreground w-[--sidebar-width] p-0 [&>button]:hidden",
              style: `--sidebar-width: ${stringify(SIDEBAR_WIDTH_MOBILE)};`,
              side,
              children: ($$payload3) => {
                $$payload3.out += `<div class="flex h-full w-full flex-col">`;
                children?.($$payload3);
                $$payload3.out += `<!----></div>`;
              },
              $$slots: { default: true }
            });
            $$payload2.out += `<!---->`;
          },
          $$slots: { default: true }
        }
      ]));
      $$payload.out += `<!---->`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<div class="text-sidebar-foreground group peer hidden md:block"${attr("data-state", sidebar.state)}${attr("data-collapsible", sidebar.state === "collapsed" ? collapsible : "")}${attr("data-variant", variant)}${attr("data-side", side)}><div${attr("class", cn("relative h-svh w-[--sidebar-width] bg-transparent transition-[width] duration-200 ease-linear", "group-data-[collapsible=offcanvas]:w-0", "group-data-[side=right]:rotate-180", variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]" : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"))}></div> <div${spread_attributes({
        class: cn(
          "fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] duration-200 ease-linear md:flex",
          side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]" : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className
        ),
        ...restProps
      })}><div data-sidebar="sidebar" class="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow">`;
      children?.($$payload);
      $$payload.out += `<!----></div></div></div>`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function Chevron_right($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [["path", { "d": "m9 18 6-6-6-6" }]];
  Icon($$payload, spread_props([
    { name: "chevron-right" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Nav_main($$payload, $$props) {
  push();
  let { items } = $$props;
  let highlightedItem = items[0];
  let highlightedSubItem = null;
  $$payload.out += `<!---->`;
  Sidebar_group($$payload, {
    children: ($$payload2) => {
      $$payload2.out += `<!---->`;
      Sidebar_group_label($$payload2, {
        children: ($$payload3) => {
          $$payload3.out += `<!---->Platform`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> <!---->`;
      Sidebar_menu($$payload2, {
        children: ($$payload3) => {
          const each_array = ensure_array_like(items);
          $$payload3.out += `<!--[-->`;
          for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
            let mainItem = each_array[$$index_1];
            $$payload3.out += `<!---->`;
            {
              let child = function($$payload4, { props }) {
                $$payload4.out += `<!---->`;
                Sidebar_menu_item($$payload4, spread_props([
                  props,
                  {
                    children: ($$payload5) => {
                      $$payload5.out += `<!---->`;
                      {
                        let child2 = function($$payload6, { props: props2 }) {
                          $$payload6.out += `<!---->`;
                          {
                            let tooltipContent = function($$payload7) {
                              $$payload7.out += `<!---->${escape_html(mainItem.title)}`;
                            }, child3 = function($$payload7, { props: props3 }) {
                              $$payload7.out += `<a${spread_attributes({ href: mainItem.url, ...props3 })}><!---->`;
                              mainItem.icon($$payload7, { class: "w-6 h-6" });
                              $$payload7.out += `<!----> <span>${escape_html(mainItem.title)}</span> `;
                              if (mainItem.title !== "Dashboard") {
                                $$payload7.out += "<!--[-->";
                                Chevron_right($$payload7, {
                                  class: "ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                                });
                              } else {
                                $$payload7.out += "<!--[!-->";
                              }
                              $$payload7.out += `<!--]--></a>`;
                            };
                            Sidebar_menu_button($$payload6, spread_props([
                              props2,
                              {
                                onclick: () => {
                                  highlightedItem = mainItem, highlightedSubItem = mainItem.items?.length ? mainItem.items[0] : null;
                                },
                                isActive: highlightedItem.title === mainItem.title,
                                tooltipContent,
                                child: child3,
                                $$slots: { tooltipContent: true, child: true }
                              }
                            ]));
                          }
                          $$payload6.out += `<!---->`;
                        };
                        Trigger$1($$payload5, { child: child2, $$slots: { child: true } });
                      }
                      $$payload5.out += `<!----> <!---->`;
                      Content($$payload5, {
                        children: ($$payload6) => {
                          if (mainItem.items) {
                            $$payload6.out += "<!--[-->";
                            $$payload6.out += `<!---->`;
                            Sidebar_menu_sub($$payload6, {
                              children: ($$payload7) => {
                                const each_array_1 = ensure_array_like(mainItem.items);
                                $$payload7.out += `<!--[-->`;
                                for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
                                  let subItem = each_array_1[$$index];
                                  $$payload7.out += `<!---->`;
                                  Sidebar_menu_sub_item($$payload7, {
                                    children: ($$payload8) => {
                                      $$payload8.out += `<!---->`;
                                      {
                                        let child2 = function($$payload9, { props: props2 }) {
                                          $$payload9.out += `<a${spread_attributes({ href: subItem.url, ...props2 })}><span>${escape_html(subItem.title)}</span></a>`;
                                        };
                                        Sidebar_menu_sub_button($$payload8, {
                                          onclick: () => {
                                            highlightedItem = mainItem;
                                            highlightedSubItem = subItem;
                                          },
                                          isActive: highlightedSubItem?.title === subItem.title,
                                          child: child2,
                                          $$slots: { child: true }
                                        });
                                      }
                                      $$payload8.out += `<!---->`;
                                    },
                                    $$slots: { default: true }
                                  });
                                  $$payload7.out += `<!---->`;
                                }
                                $$payload7.out += `<!--]-->`;
                              },
                              $$slots: { default: true }
                            });
                            $$payload6.out += `<!---->`;
                          } else {
                            $$payload6.out += "<!--[!-->";
                          }
                          $$payload6.out += `<!--]-->`;
                        },
                        $$slots: { default: true }
                      });
                      $$payload5.out += `<!---->`;
                    },
                    $$slots: { default: true }
                  }
                ]));
                $$payload4.out += `<!---->`;
              };
              Root$2($$payload3, {
                open: mainItem.isActive,
                class: "group/collapsible",
                child,
                $$slots: { child: true }
              });
            }
            $$payload3.out += `<!---->`;
          }
          $$payload3.out += `<!--]-->`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!---->`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!---->`;
  pop();
}
function Avatar($$payload, $$props) {
  push();
  let {
    class: className,
    ref = null,
    loadingStatus = "loading",
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Avatar$1($$payload2, spread_props([
      {
        get loadingStatus() {
          return loadingStatus;
        },
        set loadingStatus($$value) {
          loadingStatus = $$value;
          $$settled = false;
        },
        get ref() {
          return ref;
        },
        set ref($$value) {
          ref = $$value;
          $$settled = false;
        },
        class: cn("relative flex size-10 shrink-0 overflow-hidden rounded-full", className)
      },
      restProps
    ]));
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref, loadingStatus });
  pop();
}
function Avatar_image($$payload, $$props) {
  push();
  let {
    class: className,
    src,
    alt,
    ref = null,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Avatar_image$1($$payload2, spread_props([
      {
        get ref() {
          return ref;
        },
        set ref($$value) {
          ref = $$value;
          $$settled = false;
        },
        src,
        alt,
        class: cn("aspect-square h-full w-full", className)
      },
      restProps
    ]));
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
function Avatar_fallback($$payload, $$props) {
  push();
  let {
    class: className,
    ref = null,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Avatar_fallback$1($$payload2, spread_props([
      {
        get ref() {
          return ref;
        },
        set ref($$value) {
          ref = $$value;
          $$settled = false;
        },
        class: cn("bg-muted flex h-full w-full items-center justify-center rounded-full", className)
      },
      restProps
    ]));
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
function Dropdown_menu_content($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    sideOffset = 4,
    portalProps,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Portal($$payload2, spread_props([
      portalProps,
      {
        children: ($$payload3) => {
          $$payload3.out += `<!---->`;
          Dropdown_menu_content$1($$payload3, spread_props([
            {
              get ref() {
                return ref;
              },
              set ref($$value) {
                ref = $$value;
                $$settled = false;
              },
              sideOffset,
              class: cn("bg-popover text-popover-foreground z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 outline-none", className)
            },
            restProps
          ]));
          $$payload3.out += `<!---->`;
        },
        $$slots: { default: true }
      }
    ]));
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
function Dropdown_menu_item($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    inset,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Menu_item($$payload2, spread_props([
      {
        get ref() {
          return ref;
        },
        set ref($$value) {
          ref = $$value;
          $$settled = false;
        },
        class: cn("data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className)
      },
      restProps
    ]));
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
function Dropdown_menu_label($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    inset,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<div${spread_attributes({
    class: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
    ...restProps
  })}>`;
  children?.($$payload);
  $$payload.out += `<!----></div>`;
  bind_props($$props, { ref });
  pop();
}
function Dropdown_menu_separator($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Menu_separator($$payload2, spread_props([
      {
        get ref() {
          return ref;
        },
        set ref($$value) {
          ref = $$value;
          $$settled = false;
        },
        class: cn("bg-muted -mx-1 my-1 h-px", className)
      },
      restProps
    ]));
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
const Root = Menu;
const Trigger = Menu_trigger;
const Group = Menu_group;
function Badge_check($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
      }
    ],
    ["path", { "d": "m9 12 2 2 4-4" }]
  ];
  Icon($$payload, spread_props([
    { name: "badge-check" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Chevrons_up_down($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "m7 15 5 5 5-5" }],
    ["path", { "d": "m7 9 5-5 5 5" }]
  ];
  Icon($$payload, spread_props([
    { name: "chevrons-up-down" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Log_out($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      { "d": "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }
    ],
    [
      "polyline",
      { "points": "16 17 21 12 16 7" }
    ],
    [
      "line",
      {
        "x1": "21",
        "x2": "9",
        "y1": "12",
        "y2": "12"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "log-out" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Settings($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
      }
    ],
    [
      "circle",
      { "cx": "12", "cy": "12", "r": "3" }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "settings" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Nav_user($$payload, $$props) {
  push();
  let user = $$props["user"];
  const sidebar = useSidebar();
  let isLoading = false;
  const navigateToProfile = () => {
    goto();
  };
  async function logout() {
    try {
      isLoading = true;
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error logging out:", error.message);
        return;
      }
      userStore.set({
        session: null,
        isVerified: false,
        userRole: null,
        departmentName: "",
        profilePic: null,
        email: null,
        firstName: "New",
        lastName: "User"
      });
      await goto("/login");
    } catch (err) {
      console.error("Unexpected error during logout:", err);
    } finally {
      isLoading = false;
    }
  }
  Sidebar_menu($$payload, {
    children: ($$payload2) => {
      Sidebar_menu_item($$payload2, {
        children: ($$payload3) => {
          Root($$payload3, {
            children: ($$payload4) => {
              {
                let child = function($$payload5, { props }) {
                  Sidebar_menu_button($$payload5, spread_props([
                    {
                      size: "lg",
                      class: "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    },
                    props,
                    {
                      children: ($$payload6) => {
                        Avatar($$payload6, {
                          class: "h-8 w-8 rounded-lg",
                          children: ($$payload7) => {
                            Avatar_image($$payload7, {
                              src: user.profilePic,
                              alt: `${user.firstName} ${user.lastName}`
                            });
                            $$payload7.out += `<!----> `;
                            Avatar_fallback($$payload7, {
                              class: "rounded-lg",
                              children: ($$payload8) => {
                                $$payload8.out += `<!---->${escape_html(user.firstName?.charAt(0))}${escape_html(user.lastName?.charAt(0) || "U")}`;
                              },
                              $$slots: { default: true }
                            });
                            $$payload7.out += `<!---->`;
                          },
                          $$slots: { default: true }
                        });
                        $$payload6.out += `<!----> <div class="grid flex-1 text-left text-sm leading-tight"><span class="truncate font-semibold">${escape_html(user.firstName)} ${escape_html(user.lastName)}</span> <span class="truncate text-xs">`;
                        if (user.userRole === "admin") {
                          $$payload6.out += "<!--[-->";
                          $$payload6.out += `Admin`;
                        } else {
                          $$payload6.out += "<!--[!-->";
                          if (user.userRole === "vice_president") {
                            $$payload6.out += "<!--[-->";
                            $$payload6.out += `Vice President`;
                          } else {
                            $$payload6.out += "<!--[!-->";
                            if (user.userRole === "president") {
                              $$payload6.out += "<!--[-->";
                              $$payload6.out += `President`;
                            } else {
                              $$payload6.out += "<!--[!-->";
                              $$payload6.out += `${escape_html(user.departmentName || "Unknown")}`;
                            }
                            $$payload6.out += `<!--]-->`;
                          }
                          $$payload6.out += `<!--]-->`;
                        }
                        $$payload6.out += `<!--]--></span></div> `;
                        Chevrons_up_down($$payload6, { class: "ml-auto size-4" });
                        $$payload6.out += `<!---->`;
                      },
                      $$slots: { default: true }
                    }
                  ]));
                };
                Trigger($$payload4, { child, $$slots: { child: true } });
              }
              $$payload4.out += `<!----> `;
              Dropdown_menu_content($$payload4, {
                class: "w-[--bits-dropdown-menu-anchor-width] min-w-56 rounded-lg",
                side: sidebar.isMobile ? "bottom" : "right",
                align: "end",
                sideOffset: 4,
                children: ($$payload5) => {
                  Dropdown_menu_label($$payload5, {
                    class: "p-0 font-normal",
                    children: ($$payload6) => {
                      $$payload6.out += `<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">`;
                      Avatar($$payload6, {
                        class: "h-8 w-8 rounded-lg",
                        children: ($$payload7) => {
                          Avatar_image($$payload7, {
                            src: user.profilePic,
                            alt: `${user.firstName} ${user.lastName}`
                          });
                          $$payload7.out += `<!----> `;
                          Avatar_fallback($$payload7, {
                            class: "rounded-lg",
                            children: ($$payload8) => {
                              $$payload8.out += `<!---->${escape_html(user.firstName?.charAt(0))}${escape_html(user.lastName?.charAt(0) || "U")}`;
                            },
                            $$slots: { default: true }
                          });
                          $$payload7.out += `<!---->`;
                        },
                        $$slots: { default: true }
                      });
                      $$payload6.out += `<!----> <div class="grid flex-1 text-left text-sm leading-tight"><span class="truncate font-semibold">${escape_html(user.firstName)} ${escape_html(user.lastName)}</span> <span class="truncate text-xs">`;
                      if (user.userRole === "admin") {
                        $$payload6.out += "<!--[-->";
                        $$payload6.out += `Admin`;
                      } else {
                        $$payload6.out += "<!--[!-->";
                        if (user.userRole === "vice_president") {
                          $$payload6.out += "<!--[-->";
                          $$payload6.out += `Vice President`;
                        } else {
                          $$payload6.out += "<!--[!-->";
                          if (user.userRole === "president") {
                            $$payload6.out += "<!--[-->";
                            $$payload6.out += `President`;
                          } else {
                            $$payload6.out += "<!--[!-->";
                            $$payload6.out += `${escape_html(user.departmentName || "Unknown")}`;
                          }
                          $$payload6.out += `<!--]-->`;
                        }
                        $$payload6.out += `<!--]-->`;
                      }
                      $$payload6.out += `<!--]--></span></div></div>`;
                    },
                    $$slots: { default: true }
                  });
                  $$payload5.out += `<!----> `;
                  Dropdown_menu_separator($$payload5, {});
                  $$payload5.out += `<!----> `;
                  Group($$payload5, {
                    children: ($$payload6) => {
                      Dropdown_menu_item($$payload6, {
                        onclick: navigateToProfile,
                        children: ($$payload7) => {
                          Badge_check($$payload7, {});
                          $$payload7.out += `<!----> Account`;
                        },
                        $$slots: { default: true }
                      });
                      $$payload6.out += `<!----> `;
                      Dropdown_menu_item($$payload6, {
                        children: ($$payload7) => {
                          Settings($$payload7, {});
                          $$payload7.out += `<!----> Settings`;
                        },
                        $$slots: { default: true }
                      });
                      $$payload6.out += `<!---->`;
                    },
                    $$slots: { default: true }
                  });
                  $$payload5.out += `<!----> `;
                  Dropdown_menu_separator($$payload5, {});
                  $$payload5.out += `<!----> `;
                  Dropdown_menu_item($$payload5, {
                    onclick: logout,
                    children: ($$payload6) => {
                      Log_out($$payload6, {});
                      $$payload6.out += `<!----> Log out`;
                    },
                    $$slots: { default: true }
                  });
                  $$payload5.out += `<!---->`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!---->`;
            },
            $$slots: { default: true }
          });
        },
        $$slots: { default: true }
      });
    },
    $$slots: { default: true }
  });
  bind_props($$props, { user });
  pop();
}
function Team_switcher($$payload, $$props) {
  push();
  let { teams } = $$props;
  useSidebar();
  let activeTeam = teams[0];
  $$payload.out += `<!---->`;
  Sidebar_menu($$payload, {
    children: ($$payload2) => {
      $$payload2.out += `<!---->`;
      Sidebar_menu_item($$payload2, {
        children: ($$payload3) => {
          $$payload3.out += `<!---->`;
          Root($$payload3, {
            children: ($$payload4) => {
              $$payload4.out += `<!---->`;
              {
                let child = function($$payload5, { props }) {
                  $$payload5.out += `<!---->`;
                  Sidebar_menu_button($$payload5, spread_props([
                    props,
                    {
                      size: "lg",
                      class: "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
                      children: ($$payload6) => {
                        $$payload6.out += `<div class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"><!---->`;
                        activeTeam.logo($$payload6, { class: "size-4" });
                        $$payload6.out += `<!----></div> <div class="grid flex-1 text-left text-sm leading-tight"><span class="truncate font-semibold">${escape_html(activeTeam.name)}</span> <span class="truncate text-xs">${escape_html(activeTeam.plan)}</span></div>`;
                      },
                      $$slots: { default: true }
                    }
                  ]));
                  $$payload5.out += `<!---->`;
                };
                Trigger($$payload4, { child, $$slots: { child: true } });
              }
              $$payload4.out += `<!---->`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!---->`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!---->`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!---->`;
  pop();
}
function Gallery_vertical_end($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M7 2h10" }],
    ["path", { "d": "M5 6h14" }],
    [
      "rect",
      {
        "width": "18",
        "height": "12",
        "x": "3",
        "y": "10",
        "rx": "2"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "gallery-vertical-end" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Bot($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M12 8V4H8" }],
    [
      "rect",
      {
        "width": "16",
        "height": "12",
        "x": "4",
        "y": "8",
        "rx": "2"
      }
    ],
    ["path", { "d": "M2 14h2" }],
    ["path", { "d": "M20 14h2" }],
    ["path", { "d": "M15 13v2" }],
    ["path", { "d": "M9 13v2" }]
  ];
  Icon($$payload, spread_props([
    { name: "bot" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Chart_pie($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z"
      }
    ],
    [
      "path",
      { "d": "M21.21 15.89A10 10 0 1 1 8 2.83" }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "chart-pie" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Chart_area($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M3 3v16a2 2 0 0 0 2 2h16" }],
    [
      "path",
      {
        "d": "M7 11.207a.5.5 0 0 1 .146-.353l2-2a.5.5 0 0 1 .708 0l3.292 3.292a.5.5 0 0 0 .708 0l4.292-4.292a.5.5 0 0 1 .854.353V16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1z"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "chart-area" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Square_terminal($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "m7 11 2-2-2-2" }],
    ["path", { "d": "M11 13h4" }],
    [
      "rect",
      {
        "width": "18",
        "height": "18",
        "x": "3",
        "y": "3",
        "rx": "2",
        "ry": "2"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "square-terminal" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function App_sidebar($$payload, $$props) {
  push();
  var $$store_subs;
  const adminData = {
    user: {
      name: "Admin User",
      email: "admin@example.com",
      avatar: "/avatars/admin.jpg"
    },
    teams: [
      {
        name: "Eucorp",
        logo: Gallery_vertical_end,
        plan: "Enterprise"
      }
    ],
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Square_terminal,
        isActive: true
      },
      {
        title: "User Management",
        url: "/users",
        icon: Bot,
        items: [
          { title: "Users", url: "/users" },
          { title: "Departments", url: "/departments" },
          { title: "Leads", url: "/leads" },
          {
            title: "Classifications",
            url: "/classification"
          },
          {
            title: "Ratings Management",
            url: "/riskManagement"
          },
          { title: "School Years", url: "/school-year" }
        ]
      },
      {
        title: "Planning",
        url: "/plans",
        icon: Chart_pie,
        items: [
          { title: "Strategic Goals", url: "/plans" },
          { title: "Risks", url: "/risks" },
          { title: "Opportunities", url: "/opportunities" }
        ]
      },
      {
        title: "Monitoring",
        url: "/monitoring/mid-year",
        icon: Chart_area,
        items: [
          {
            title: "Mid-Year Monitoring ",
            url: "/monitoring/mid-year"
          },
          {
            title: "Year-End Monitoring",
            url: "/monitoring/year-end"
          }
        ]
      }
    ]
  };
  const userData = {
    user: {
      name: "Regular User",
      email: "user@example.com",
      avatar: "/avatars/user.jpg"
    },
    teams: [
      {
        name: "Eucorp",
        logo: Gallery_vertical_end,
        plan: "Enterprise"
      }
    ],
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Square_terminal,
        isActive: true
      },
      {
        title: "Planning",
        url: "/plans/operationalPlans",
        icon: Chart_pie,
        items: [
          {
            title: "Operational Planning",
            url: "/plans/operationalPlans"
          },
          { title: "Risks Register", url: "/risks" },
          {
            title: "Opportunities Register",
            url: "/opportunities"
          }
        ]
      },
      {
        title: "Monitoring",
        url: "/monitoring/mid-year",
        icon: Chart_area,
        items: [
          {
            title: "Mid-Year Monitoring ",
            url: "/monitoring/mid-year"
          },
          {
            title: "Year-End Monitoring",
            url: "/monitoring/year-end"
          }
        ]
      }
    ]
  };
  const sidebarData = derived(userStore, ($userStore) => $userStore.userRole === "admin" || $userStore.userRole === "vice_president" || $userStore.userRole === "president" ? adminData : userData);
  let {
    ref = null,
    collapsible = "icon",
    variant = "floating",
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Sidebar($$payload2, spread_props([
      {
        get ref() {
          return ref;
        },
        set ref($$value) {
          ref = $$value;
          $$settled = false;
        },
        collapsible,
        variant
      },
      restProps,
      {
        children: ($$payload3) => {
          $$payload3.out += `<!---->`;
          Sidebar_header($$payload3, {
            children: ($$payload4) => {
              Team_switcher($$payload4, {
                teams: store_get($$store_subs ??= {}, "$sidebarData", sidebarData).teams
              });
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!----> <!---->`;
          Sidebar_content($$payload3, {
            children: ($$payload4) => {
              Nav_main($$payload4, {
                items: store_get($$store_subs ??= {}, "$sidebarData", sidebarData).navMain
              });
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!----> <!---->`;
          Sidebar_footer($$payload3, {
            children: ($$payload4) => {
              Nav_user($$payload4, {
                user: store_get($$store_subs ??= {}, "$userStore", userStore)
              });
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!----> <!---->`;
          Sidebar_rail($$payload3, {});
          $$payload3.out += `<!---->`;
        },
        $$slots: { default: true }
      }
    ]));
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { ref });
  pop();
}
function Breadcrumb($$payload, $$props) {
  push();
  let {
    ref = void 0,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<nav${spread_attributes({
    class: className,
    "aria-label": "breadcrumb",
    ...restProps
  })}>`;
  children?.($$payload);
  $$payload.out += `<!----></nav>`;
  bind_props($$props, { ref });
  pop();
}
function Breadcrumb_item($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<li${spread_attributes({
    class: cn("inline-flex items-center gap-1.5", className),
    ...restProps
  })}>`;
  children?.($$payload);
  $$payload.out += `<!----></li>`;
  bind_props($$props, { ref });
  pop();
}
function Breadcrumb_separator($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<li${spread_attributes({
    role: "presentation",
    "aria-hidden": "true",
    class: cn("[&>svg]:size-3.5", className),
    ...restProps
  })}>`;
  if (children) {
    $$payload.out += "<!--[-->";
    children?.($$payload);
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    Chevron_right($$payload, {});
  }
  $$payload.out += `<!--]--></li>`;
  bind_props($$props, { ref });
  pop();
}
function Breadcrumb_link($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    href = void 0,
    child,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const attrs = {
    class: cn("hover:text-foreground transition-colors", className),
    href,
    ...restProps
  };
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: attrs });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<a${spread_attributes({ ...attrs })}>`;
    children?.($$payload);
    $$payload.out += `<!----></a>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function Breadcrumb_list($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<ol${spread_attributes({
    class: cn("text-muted-foreground flex flex-wrap items-center gap-1.5 break-words text-sm sm:gap-2.5", className),
    ...restProps
  })}>`;
  children?.($$payload);
  $$payload.out += `<!----></ol>`;
  bind_props($$props, { ref });
  pop();
}
function Breadcrumb_page($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<span${spread_attributes({
    role: "link",
    "aria-disabled": "true",
    "aria-current": "page",
    class: cn("text-foreground font-normal", className),
    ...restProps
  })}>`;
  children?.($$payload);
  $$payload.out += `<!----></span>`;
  bind_props($$props, { ref });
  pop();
}
function _page($$payload) {
  Sidebar_provider($$payload, {
    children: ($$payload2) => {
      App_sidebar($$payload2, {});
      $$payload2.out += `<!----> `;
      Sidebar_inset($$payload2, {
        children: ($$payload3) => {
          $$payload3.out += `<header class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"><div class="flex items-center gap-2 px-4">`;
          Sidebar_trigger($$payload3, { class: "-ml-1" });
          $$payload3.out += `<!----> `;
          Separator($$payload3, { orientation: "vertical", class: "mr-2 h-4" });
          $$payload3.out += `<!----> `;
          Breadcrumb($$payload3, {
            children: ($$payload4) => {
              Breadcrumb_list($$payload4, {
                children: ($$payload5) => {
                  Breadcrumb_item($$payload5, {
                    class: "hidden md:block",
                    children: ($$payload6) => {
                      Breadcrumb_link($$payload6, {
                        href: "#",
                        children: ($$payload7) => {
                          $$payload7.out += `<!---->Building Your Application`;
                        },
                        $$slots: { default: true }
                      });
                    },
                    $$slots: { default: true }
                  });
                  $$payload5.out += `<!----> `;
                  Breadcrumb_separator($$payload5, { class: "hidden md:block" });
                  $$payload5.out += `<!----> `;
                  Breadcrumb_item($$payload5, {
                    children: ($$payload6) => {
                      Breadcrumb_page($$payload6, {
                        children: ($$payload7) => {
                          $$payload7.out += `<!---->Data Fetching`;
                        },
                        $$slots: { default: true }
                      });
                    },
                    $$slots: { default: true }
                  });
                  $$payload5.out += `<!---->`;
                },
                $$slots: { default: true }
              });
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!----></div></header> <div class="flex flex-1 flex-col gap-4 p-4 pt-0"><div class="grid auto-rows-min gap-4 md:grid-cols-3"><div class="bg-muted/50 aspect-video rounded-xl"></div> <div class="bg-muted/50 aspect-video rounded-xl"></div> <div class="bg-muted/50 aspect-video rounded-xl"></div></div> <div class="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min"></div></div>`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!---->`;
    },
    $$slots: { default: true }
  });
}
export {
  _page as default
};
