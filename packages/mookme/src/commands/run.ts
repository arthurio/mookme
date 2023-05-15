import commander from 'commander';

import { GitToolkit } from '../utils/git';
import { Config } from '../config';
import { MookmeUI } from '../ui';
import { RunOptions, RunRunner } from '../runner/run';
import { HooksResolver } from '../loaders/hooks-resolver';
import Debug from 'debug';
import { NoClearRenderer } from '../ui/renderers/noclear-renderer';
import { FancyRenderer } from '../ui/renderers/fancy-renderer';

const debug = Debug('mookme');

/**
 * Extend an existing commander program instance with the `run` command of Mookme
 *
 * @param program - the instance of the commander program to extend
 */
export function addRun(program: commander.Command): void {
  program
    .command('run')
    .requiredOption(
      '-t, --type <type>',
      'A valid git hook type ("pre-commit", "prepare-commit", "commit-msg", "post-commit")',
    )
    .option('-a, --all', 'Run hooks for all packages', '')
    .option('--from <from>', 'Starting git reference used to evaluate hooks to run', '')
    .option('--to <to>', 'Ending git reference used to evaluate hooks to run', '')
    .option('--args <args>', 'The arguments being passed to the hooks', '')
    .option('--config-root <configRoot>', 'The path of the folder where the mookme configuration file is stored', '')
    .action(async (opts: RunOptions) => {
      debug('Running run command with options', opts);
      const git = new GitToolkit();

      // Load the different config files
      const config = new Config(opts.configRoot || git.rootDir);

      // Initialize the UI
      const ui = new MookmeUI(false, config.noClearRenderer ? new NoClearRenderer() : new FancyRenderer());
      const resolver = new HooksResolver(git, opts.type, { useAllFiles: opts.all, from: opts.from, to: opts.to });

      // Instanciate a runner instance for the run command, and start it against the provided options
      const runner = new RunRunner(ui, config, git, resolver);
      await runner.run(opts);
    });
}
