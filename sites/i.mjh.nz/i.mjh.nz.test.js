// npm run channels:parse -- --config=./sites/i.mjh.nz/i.mjh.nz.config.js --output=./sites/i.mjh.nz/i.mjh.nz_au.channels.xml --set=provider:au
// npm run channels:parse -- --config=./sites/i.mjh.nz/i.mjh.nz.config.js --output=./sites/i.mjh.nz/i.mjh.nz_binge.channels.xml --set=provider:binge
// npm run channels:parse -- --config=./sites/i.mjh.nz/i.mjh.nz.config.js --output=./sites/i.mjh.nz/i.mjh.nz_dstv.channels.xml --set=provider:dstv
// npm run channels:parse -- --config=./sites/i.mjh.nz/i.mjh.nz.config.js --output=./sites/i.mjh.nz/i.mjh.nz_flash.channels.xml --set=provider:flash
// npm run channels:parse -- --config=./sites/i.mjh.nz/i.mjh.nz.config.js --output=./sites/i.mjh.nz/i.mjh.nz_foxtel.channels.xml --set=provider:foxtel
// npm run channels:parse -- --config=./sites/i.mjh.nz/i.mjh.nz.config.js --output=./sites/i.mjh.nz/i.mjh.nz_hgtvgo.channels.xml --set=provider:hgtvgo
// npm run channels:parse -- --config=./sites/i.mjh.nz/i.mjh.nz.config.js --output=./sites/i.mjh.nz/i.mjh.nz_kayo.channels.xml --set=provider:kayo
// npm run channels:parse -- --config=./sites/i.mjh.nz/i.mjh.nz.config.js --output=./sites/i.mjh.nz/i.mjh.nz_metv.channels.xml --set=provider:metv
// npm run channels:parse -- --config=./sites/i.mjh.nz/i.mjh.nz.config.js --output=./sites/i.mjh.nz/i.mjh.nz_nz.channels.xml --set=provider:nz
// npm run channels:parse -- --config=./sites/i.mjh.nz/i.mjh.nz.config.js --output=./sites/i.mjh.nz/i.mjh.nz_optus.channels.xml --set=provider:optus
// npm run channels:parse -- --config=./sites/i.mjh.nz/i.mjh.nz.config.js --output=./sites/i.mjh.nz/i.mjh.nz_pbs.channels.xml --set=provider:pbs
// npm run channels:parse -- --config=./sites/i.mjh.nz/i.mjh.nz.config.js --output=./sites/i.mjh.nz/i.mjh.nz_plex.channels.xml --set=provider:plex
// npm run channels:parse -- --config=./sites/i.mjh.nz/i.mjh.nz.config.js --output=./sites/i.mjh.nz/i.mjh.nz_pluto.channels.xml --set=provider:pluto
// npm run channels:parse -- --config=./sites/i.mjh.nz/i.mjh.nz.config.js --output=./sites/i.mjh.nz/i.mjh.nz_roku.channels.xml --set=provider:roku
// npm run channels:parse -- --config=./sites/i.mjh.nz/i.mjh.nz.config.js --output=./sites/i.mjh.nz/i.mjh.nz_samsung.channels.xml --set=provider:samsung
// npm run channels:parse -- --config=./sites/i.mjh.nz/i.mjh.nz.config.js --output=./sites/i.mjh.nz/i.mjh.nz_singtel.channels.xml --set=provider:singtel
// npm run channels:parse -- --config=./sites/i.mjh.nz/i.mjh.nz.config.js --output=./sites/i.mjh.nz/i.mjh.nz_skygo.channels.xml --set=provider:skygo
// npm run channels:parse -- --config=./sites/i.mjh.nz/i.mjh.nz.config.js --output=./sites/i.mjh.nz/i.mjh.nz_skysportnow.channels.xml --set=provider:skysportnow
// npm run channels:parse -- --config=./sites/i.mjh.nz/i.mjh.nz.config.js --output=./sites/i.mjh.nz/i.mjh.nz_stirr.channels.xml --set=provider:stirr
// npm run grab -- --channels=./sites/i.mjh.nz/i.mjh.nz_pluto.channels.xml

const { parser, url } = require('./i.mjh.nz.config.js')
const fs = require('fs')
const path = require('path')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
dayjs.extend(utc)

const date = dayjs.utc('2023-06-23', 'YYYY-MM-DD').startOf('d')
const channel = {
  site_id: 'Plex/all#5e20b730f2f8d5003d739db7-5eea605674085f0040ddc7a6',
  xmltv_id: 'DarkMatterTV.us',
  lang: 'en'
}

it('can generate valid url', () => {
  expect(url({ channel })).toBe(
    'https://raw.githubusercontent.com/matthuisman/i.mjh.nz/master/Plex/all.xml'
  )
})

it('can parse response', () => {
  const content = fs.readFileSync(path.resolve(__dirname, '__data__/content.xml'))
  const results = parser({ content, channel, date })

  expect(results.length).toBe(11)
  expect(results[0]).toMatchObject({
    start: '2023-06-23T07:14:32.000Z',
    stop: '2023-06-23T09:09:36.000Z',
    title: 'Killers Within',
    date: ['20180101'],
    description:
      'With her son being held captive by a criminal gang, police officer Amanda Doyle, together with her ex-husband and three unlikely allies, takes part in a desperate plot to hold a wealthy banker and his family to ransom. But this is no ordinary family.',
    icon: ['https://provider-static.plex.tv/epg/images/thumbnails/darkmatter-tv-fallback.jpg'],
    categories: ['Movie']
  })
})

it('can handle empty guide', () => {
  const result = parser({
    content: '404: Not Found',
    channel,
    date
  })
  expect(result).toMatchObject([])
})
