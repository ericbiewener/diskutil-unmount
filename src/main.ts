import execall from 'execall'
import { log } from 'log-all-the-things'
import { defaultSpawnSync } from 'utlz'
import yargs from 'yargs'

const { diskName } = (yargs.command(
  '* <diskName>',
  'Fetch Yabas Sepcs and Generate Code',
  yargs => {
    yargs.positional('diskName', {
      describe: 'Name of the disk you want to unmount',
      type: 'string',
    })
  }
).argv as unknown) as { diskName: string }

const diskNameLowerCase = diskName.toLowerCase()

const fullText = defaultSpawnSync('diskutil', ['list'])
const matches = execall(/^\/dev.*/gm, fullText)

for (let i = 0; i < matches.length; i++) {
  const match = matches[i]
  const nextMatch = matches[i + 1]
  const text = fullText.slice(match.index, nextMatch && nextMatch.index)
  if (text.toLowerCase().includes(diskNameLowerCase)) {
    const result = defaultSpawnSync('diskutil', ['unmountDisk', match.match.split(' ')[0]])
    log()
      .blue(result)
      .green('We think this was successful')()
    process.exit(0)
  }
}

log().red(`Disk "${diskName}" not found. Available disks:\n\n${fullText}`)
process.exit(1)
