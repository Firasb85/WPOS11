import type { SecureNavItem } from "../wpos/constants/navigation";
import { navigation as wposNavigation } from "../wpos/constants/navigation";

/**
 * Re-export as SecureNavItem[] to preserve allowedRoles.
 * DO NOT cast to NavItem[] — that strips the role data.
 */
export const navigation: SecureNavItem[] = wposNavigation;
