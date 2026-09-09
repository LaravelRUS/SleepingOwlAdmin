export const DROPDOWN_FEATURE_ID = 'dropdown'

export {
    DROPDOWN_COMPONENT,
    DROPDOWN_ROOT_SELECTOR,
    installDropdowns,
} from './install-dropdowns.js'
export {
    collectDropdownToggles,
    DROPDOWN_CONTAINER_SELECTOR,
    dropdownContext,
    dropdownItems,
    DROPDOWN_ITEM_SELECTOR,
    DROPDOWN_MENU_SELECTOR,
    DROPDOWN_TOGGLE_SELECTOR,
    findDropdownItem,
    findDropdownToggle,
    isDropdownDisabled,
} from './dropdown-elements.js'
export { dropdownNavigationTarget, DROPDOWN_NAVIGATION_KEYS } from './dropdown-navigation.js'
export { closeDropdown, normalizeDropdown, openDropdown } from './dropdown-state.js'
export { mountDropdowns } from './dropdowns.js'
