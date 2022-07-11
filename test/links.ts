import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import t from 'tap'

const dir = resolve(__dirname, '../content')
const find = spawnSync('find', ['.', '-type', 'f'], { cwd: dir })
process.stderr.write(find.stderr)
const { status, signal } = find
if (status || signal) {
  t.fail('failed to find files', { status, signal })
  process.exit(find.status || 1)
}
const files = find.stdout.toString().trim().split('\n')

t.plan(files.length)
for (const f of files) {
  t.test(f, t => {
    const content = readFileSync(resolve(dir, f), 'utf8').trim()
    t.not(content, '', 'should have content')

    t.test('includes', t => {
      const re = /<!--\s*include\s*(.+?)\s*-->/g
      let match: ReturnType<typeof re.exec>
      while ((match = re.exec(content))) {
        const target = match[1].trim()
        if (/^https?:\/\//.test(target)) {
          continue
        }
        try {
          readFileSync(resolve(dir, target + '.md'))
          t.pass(`found include target: content/${target}.md`)
        } catch (_) {
          try {
            readFileSync(resolve(dir, target, 'index.md'))
            t.pass(`found include target: content/${target}/index.md`)
          } catch (_) {
            t.fail(`could not find include target: ${target}`)
          }
        }
      }
      t.end()
    })

    if (!/\/_drafts\//.test(f)) {
      t.test('internal links', { skip: /\/_drafts\//.test(f) }, t => {
        const re = /]\(((?:\.|\/content\/).*?)\)/gm
        let match: ReturnType<typeof re.exec>
        while ((match = re.exec(content))) {
          const target = match[1].trim()
          let file: string
          switch (target.charAt(0)) {
            case '.':
              file = resolve(dirname(resolve(dir, f)) + '/', target)
              break
            case '/':
              file = join(dirname(dir), target)
              break
            default:
              t.fail(`invalid internal link ${target}`)
              continue
          }

          try {
            readFileSync(file)
            t.pass(`valid internal link ${target}`)
          } catch (er) {
            t.fail(`invalid internal link ${target}`)
          }
        }

        t.end()
      })
    }

    t.end()
  })
}
