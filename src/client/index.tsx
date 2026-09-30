/**
 * Client half of `@elves-ai/dsh-web-search-firecrawl`: contributes the
 * "Firecrawl" page to the DSH Settings shell.
 *
 * 0.2.0-rc.2 port: the old fenced `/firecrawl/api` route is gone. The page
 * reads and writes the plugin's own profile entry through the shared
 * `configForms` service (`ConfigForms.get(entryId)`), keyed by this plugin's
 * profile entry id. The section registers itself while the Host serves the
 * entry's namespace so a composition without the plugin shows no trace.
 */

import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import { FirecrawlSettingsSection } from './FirecrawlSettingsSection.tsx'

/** Required services before mounting. */
export const inject = ['slots', 'configForms']

/**
 * Register the Firecrawl settings section.
 * @param ctx - the browser plugin context.
 */
export function apply(ctx: ClientContext): void {
  const forms = (ctx as unknown as {
    configForms: {
      whileServed: (namespaces: readonly string[], register: () => () => void) => () => void
    }
  }).configForms
  // The Host serves the entry under its namespace; `web-search-firecrawl` is
  // both the plugin short name and the served namespace key. The entry id for
  // `configForms.get` is resolved by the section itself from its slot owner.
  ctx.effect(() => forms.whileServed(['web-search-firecrawl'], () => ctx.slots.register({
    name: 'settings.section',
    id: 'firecrawl',
    order: 80,
    label: () => 'Firecrawl',
  }, FirecrawlSettingsSection)), 'web-search-firecrawl: settings section')
}
