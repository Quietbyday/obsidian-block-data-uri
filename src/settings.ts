import { App, PluginSettingTab, Setting } from 'obsidian';
import type BlockDataUriPlugin from './main';

export interface BlockDataUriSettings {
	stripOnPaste: boolean;
}

export const DEFAULT_SETTINGS: BlockDataUriSettings = {
	stripOnPaste: true,
};

export class BlockDataUriSettingTab extends PluginSettingTab {
	plugin: BlockDataUriPlugin;

	constructor(app: App, plugin: BlockDataUriPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName('Strip blocked images on paste')
			.setDesc(
				'When enabled, data URI images and gstatic.com images are automatically ' +
				'removed from text as you paste it. Disable this to paste without ' +
				'interference and use the command palette to strip images manually.'
			)
			.addToggle(toggle =>
				toggle
					.setValue(this.plugin.settings.stripOnPaste)
					.onChange(async (value) => {
						this.plugin.settings.stripOnPaste = value;
						await this.plugin.saveData(this.plugin.settings);
					})
			);
	}
}
