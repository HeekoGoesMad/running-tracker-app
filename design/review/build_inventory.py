"""Author the review inventory; the JSON drives both editable Figma and local preview."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'design/review'
screens = []

def b(kind, **props): return {'kind': kind, **props}
def text(value, role='body', color='text'): return b('text', value=value, role=role, color=color)
def section(value, action=None, target=None): return b('section', value=value, action=action, target=target)
def row(title, detail='', icon='chevron-right', target=None, trailing=None):
    return b('row', title=title, detail=detail, icon=icon, target=target, trailing=trailing)
def button(label, target=None, tone='primary', icon=None): return b('button', label=label, target=target, tone=tone, icon=icon)
def notice(title, detail, tone='muted', target=None): return b('notice', title=title, detail=detail, tone=tone, target=target)
def field(label, value, target=None): return b('field', label=label, value=value, target=target)
def stats(*values): return b('stats', values=[{'value':v,'label':k} for v,k in values])
def choice(label, detail='', selected=False, target=None): return b('choice', label=label, detail=detail, selected=selected, target=target)
def toggle(label, detail='', on=True): return b('toggle', label=label, detail=detail, on=on)
def screen(id, group, title, subtitle='', blocks=(), actions=(), nav=None, back='today', note='', theme='dark', width=400):
    screens.append(dict(id=id,group=group,title=title,subtitle=subtitle,blocks=list(blocks),actions=list(actions),nav=nav,back=back,note=note,theme=theme,width=width,height=900))

screen('welcome','01 Start','Make room\nfor your run.','A personal running journal.',[
 b('routeArt',height=220),text('Your routes. Your progress. Your pace.','headline'),
 text('Record runs, follow a plan and keep your history on your phone. No account needed.','body','muted'),
 row('Private by default','Your data stays on this device.','shield-check')
],[button('Set up my running','profile',icon='arrow-right'),button('Restore a backup','restore','secondary')],back=None)
screen('profile','01 Start','Your starting point','A plan begins with what feels comfortable.',[
 field('Comfortable run duration','30 minutes'),field('Recent weekly running','90 minutes'),field('Preferred units','Kilometers · min/km'),
 notice('No recent running history?','Start with run–walk. You can change this later.'),choice('Build a running routine','Easy, consistent sessions',True)
],[button('Continue','permission')],back='welcome')
screen('permission','01 Start','Ready when\nyou are.','Location is used while recording a run.',[
 b('routeArt',height=160),row('Precise location','Records distance and your route.','navigation'),row('Recording notification','Shows pause and stop controls.','activity'),
 text('You choose when recording starts. Calendar access is requested only when you connect a calendar.','body','muted')
],[button('Enable recording access','today'),button('Explore first','today-empty','secondary')],back='profile')
screen('today','01 Start','Today','SATURDAY, 24 OCTOBER',[
 b('workout',title='Easy run',minutes='30',label='TODAY’S SESSION',effort='Comfortable effort · RPE 2–4',target='workout'),
 section('This week','View plan','plan'),stats(('2 / 3','runs completed'),('62','minutes'),('9.8','kilometers')),
 b('chart',mode='week',height=100),row('Your last run','Thursday · 5.2 km · 32:14','route','activity'),
 notice('Keep it comfortable','No plan changes today. Your next review is Sunday.','muted','coach')
],[button('Start easy run','pre-run',icon='play')],nav='Today',back=None)
screen('today-empty','01 Start','Today','A fresh start.',[
 b('routeArt',height=160),text('Your first run\nstarts here.','headline'),text('Record a run to begin your personal journal. Your pace and route appear after you save it.','body','muted'),
 row('Create a training plan','Choose a goal and the days that fit.','calendar-days','goal'),row('Import past activities','Preview GPX files before saving.','file-up','import')
],[button('Record my first run','pre-run')],nav='Today',back=None)
screen('rest-day','01 Start','Today','SUNDAY, 25 OCTOBER',[
 text('A little space\nto recover.','headline'),b('routeArt',height=120),notice('Rest day','Your next easy run is Tuesday. Missed sessions are never stacked onto today.'),
 section('Your week'),stats(('3 / 3','runs completed'),('94','minutes'),('14.6','kilometers')),row('Review this week','Check your plan and feedback.','calendar-days','coach')
],[button('View next workout','workout','secondary')],nav='Today',back=None)

screen('pre-run','02 Record','Ready to run','GPS ready · Precise location',[
 b('map',height=240),row('Easy run · 30 min','Comfortable effort · RPE 2–4','activity','workout'),row('Riverside loop','5.2 km · Saved route','route','routes'),toggle('Workout voice cues','Uses an available offline voice.'),
 notice('Your recording stays local','Background recording remains visible in your notifications.')
],[button('Start recording','record',icon='play')],back='today')
screen('gps-weak','02 Record','Finding GPS','Weak signal',[
 b('map',height=190,quality='weak'),notice('Move into open space','A clear view of the sky usually improves location. Distance and pace stay unavailable until a reliable fix arrives.','warning'),
 row('Easy run · 30 min','Your selected workout is ready.','activity','workout'),text('You can start the workout timer now; the app will mark any missing route section.','body','muted')
],[button('Start timer anyway','record-weak'),button('Keep waiting','pre-run','secondary')],back='today')
screen('location-denied','02 Record','Location is off','Recording needs precise location.',[
 b('routeArt',height=140),notice('Allow location to record a route','Enable precise location in Android settings, then return here. Your training plan is still available.','warning'),
 row('Explore your plan','Continue without route recording.','calendar-days','plan')
],[button('Review permission','permission'),button('Back to Today','today','secondary')],back='today')
screen('record','02 Record','Easy run','RECORDING · GPS READY',[
 b('clock',value='24:18',label='ACTIVE TIME'),stats(('3.84','distance · km'),('6:20','average · /km')),
 b('segments',options=['Metrics','Map'],selected=0,targets=['record','record-map']),
 b('interval',label='EASY EFFORT',value='Keep it conversational.',detail='5:42 remaining in this session'),
 row('Voice cues on','Next update at 25 minutes.','volume-2','cues')
],[button('Pause run','paused',icon='pause')],back=None)
screen('record-map','02 Record','Easy run','RECORDING · GPS READY',[
 stats(('24:18','active time'),('3.84','distance · km')),b('segments',options=['Metrics','Map'],selected=1,targets=['record','record-map']),
 b('map',height=350,following=True),text('Following Riverside loop · 1.4 km remaining','small','muted')
],[button('Pause run','paused',icon='pause')],back=None)
screen('record-weak','02 Record','Easy run','RECORDING · WEAK GPS',[
 b('clock',value='04:12',label='ACTIVE TIME'),stats(('—','distance · km'),('—','average · /km')),notice('Your timer is still running','Route and distance need a reliable GPS signal. Missing sections will be marked in your activity.','warning'),
 b('interval',label='EASY EFFORT',value='Stay comfortable.',detail='25:48 remaining')
],[button('Pause run','paused',icon='pause')],back=None)
screen('interval','02 Record','Intervals','RECORDING · REP 2 OF 4',[
 b('clock',value='00:42',label='WORK INTERVAL REMAINING'),text('Run at a controlled effort.','headline'),stats(('15:18','active time'),('2.31','distance · km')),
 b('interval',label='UP NEXT',value='2 min easy recovery',detail='Rep 3 starts after recovery'),row('Workout steps','Warm-up · 4 repeats · Cool-down','activity','workout')
],[button('Pause workout','paused',icon='pause')],back=None)
screen('paused','02 Record','Run paused','Your route is saved up to this point.',[
 b('clock',value='24:18',label='ACTIVE TIME'),stats(('3.84','distance · km'),('6:20','average · /km')),b('map',height=180),
 text('Resume starts a new active section. Paused time does not count toward average pace.','body','muted')
],[button('Resume run','record',icon='play'),button('Finish run','finish','secondary')],back=None)
screen('finish','02 Record','Save your run','SATURDAY · 24 OCTOBER',[
 b('map',height=200),stats(('3.84','distance · km'),('24:18','active time'),('6:20','average · /km')),field('Activity title','Saturday easy run'),row('GPS quality','Good coverage · No gaps','signal','quality'),
 text('Your run will be saved on this phone.','small','muted')
],[button('Save run','check-in'),button('Keep recording','paused','secondary')],back='paused')
screen('recovery','02 Record','Your run is safe.','Recording was interrupted.',[
 notice('Last saved at 08:42','24:18 of active time and 3.84 km were saved. The missing section will be marked.','warning'),b('map',height=200,quality='gap'),stats(('24:18','saved active time'),('3.84','saved km')),
 text('Resume creates a new route section. It never draws a line through the interruption.','body','muted')
],[button('Resume saved run','record'),button('Save partial run','finish','secondary')],back=None)
screen('check-in','02 Record','How did it feel?','A quick check-in helps your next plan review.',[
 section('Effort'),b('rating',labels=['1','2','3','4','5','6','7','8','9','10'],selected=2),text('3 · Comfortable, full sentences','small','muted'),section('Fatigue'),b('segments',options=['Low','Moderate','High'],selected=0),
 section('Any discomfort?'),choice('None','',True),choice('Mild'),choice('Moderate or severe'),text('You can skip. Missing answers stay unknown.','small','muted')
],[button('Save check-in','saved'),button('Skip for now','saved','secondary')],back='finish')
screen('saved','02 Record','Run saved','Your journal is one run richer.',[
 b('success',value='Nice and steady.'),stats(('3.84','distance · km'),('24:18','active time'),('6:20','average · /km')),row('View activity','Route, splits and notes','route','activity'),row('Create a share image','Choose exactly what appears.','share-2','share'),row('Export to Strava','Save a GPX file for manual upload.','download','strava')
],[button('Back to Today','today')],back='activity')

screen('history','03 Journal','Activities','Your personal running journal.',[
 b('segments',options=['All runs','Easy','Intervals'],selected=0),section('October 2026'),row('Saturday easy run','24 Oct · 3.84 km · 24:18','route','activity',trailing='6:20 /km'),row('Riverside easy run','22 Oct · 5.20 km · 32:14','route','activity',trailing='6:12 /km'),row('Short intervals','20 Oct · 4.60 km · 30:00','activity','workout'),section('September 2026'),row('Sunday long run','27 Sep · 7.10 km · 46:12','route','activity'),row('Import activity files','GPX files are checked before saving.','file-up','import')
],nav='Progress',back='progress')
screen('activity','03 Journal','Saturday easy run','24 OCTOBER · 08:18',[
 b('map',height=230),stats(('3.84','distance · km'),('24:18','active time'),('6:20','average · /km')),b('segments',options=['Overview','Splits'],selected=0,targets=['activity','splits']),
 row('Effort 3 · Comfortable','Fatigue low · No discomfort','activity','check-in'),row('Good GPS coverage','No recording gaps','signal','quality'),row('Workout completed','24 of 30 planned minutes','calendar-days','workout'),row('Export activity file','GPX for manual Strava upload','download','strava')
],[button('Create share image','share',icon='share-2')],back='history')
screen('splits','03 Journal','Run splits','Saturday easy run',[
 stats(('3.84','distance · km'),('6:20','average · /km')),b('segments',options=['Overview','Splits'],selected=1,targets=['activity','splits']),b('splits',values=[['1','6:28','6:28'],['2','6:16','12:44'],['3','6:18','19:02'],['0.84','6:16','24:18']]),text('Last split is partial. Pace uses active time and accepted GPS distance.','body','muted')
],back='activity')
screen('progress','03 Journal','Progress','Consistency, one week at a time.',[
 b('segments',options=['Week','Month','All'],selected=0,targets=['progress','progress-month','progress-month']),stats(('14.6','kilometers'),('94','minutes'),('3','runs')),b('chart',mode='trend',height=220),
 notice('A steady month','You completed 10 of 12 planned runs. Based on saved activities, not a performance prediction.'),row('Activity journal','Routes, splits and notes','route','history'),row('Your shoes','See accumulated mileage.','footprints','shoes')
],nav='Progress',back=None)
screen('progress-month','03 Journal','Progress','OCTOBER 2026',[
 b('segments',options=['Week','Month','All'],selected=1,targets=['progress','progress-month','progress-month']),stats(('48.2','kilometers'),('311','minutes'),('10','runs')),b('chart',mode='month',height=220),
 section('Training rhythm'),row('10 of 12 planned runs','Completed this month','check-check','plan'),row('Personal route heatmap','See where you return most.','layers','heatmap')
],nav='Progress',back=None)
screen('quality','03 Journal','GPS quality','Keep estimates in perspective.',[
 notice('Good coverage','98% of active time has continuous accepted location. This is an app quality indicator, not a surveyed accuracy score.'),b('map',height=230,quality='gap'),
 row('Accepted location coverage','98% of active recording time','signal'),row('Recording interruptions','One gap · Shown as a break','triangle-alert'),text('Unreliable sections do not qualify for a personal best or trigger harder training. Your original samples are retained locally.','body','muted')
],back='activity')

screen('plan','04 Training','Your plan','WEEK 3 · BUILD A ROUTINE',[
 b('week',selected=5),b('workout',title='Easy run',minutes='30',label='SATURDAY · TODAY',effort='Comfortable effort · RPE 2–4',target='workout'),row('Tuesday · Easy run','30 min · Completed','check-check','activity'),row('Thursday · Easy run','32 min · Completed','check-check','activity'),
 notice('Weekly review is ready','Your feedback suggests keeping next week steady.','muted','coach'),row('Calendar','3 workouts scheduled','calendar-days','calendar')
],[button('Review next week','coach')],nav='Plan',back=None)
screen('goal','04 Training','What are you\nrunning toward?','You can adjust your goal later.',[
 choice('Build a routine','Consistent easy sessions',True,'days'),choice('Complete 5K','Run or run–walk at a comfortable effort',False,'days'),choice('Complete 10K','Build from your current comfortable duration',False,'days'),choice('Improve my 5K or 10K','Uses your recent, reliable running history',False,'days'),row('Build my own program','Choose workouts manually.','plus','editor')
],[button('Choose training days','days')],back='plan')
screen('days','04 Training','Make it fit.','Choose the days you usually have time.',[
 b('week',selected=[1,3,5],multi=True),field('Weekday session budget','30 minutes'),field('Longer session budget','45 minutes'),field('Preferred time','07:00'),notice('Space for recovery','Hard workouts are never placed on consecutive days. Missing sessions are not added to another day.'),row('Starting point','30 min comfortable run · 90 min recent week','activity','profile')
],[button('Preview my plan','plan-preview')],back='goal')
screen('plan-preview','04 Training','Your first four weeks','Review before activating.',[
 stats(('3','runs / week'),('90','minutes / week')),b('chart',mode='plan',height=150),row('Tuesday · Easy run','27 min · Comfortable effort','activity','workout'),row('Thursday · Easy run','27 min · Comfortable effort','activity','workout'),row('Saturday · Longer easy run','36 min · Stay conversational','route','workout'),notice('A starting plan, not a prediction','The rules review your completed runs and check-ins. Future changes always need your approval.')
],[button('Use this plan','plan'),button('Edit workouts first','editor','secondary')],back='days')
screen('workout','04 Training','Easy run','SATURDAY · 30 MINUTES',[
 b('workout',title='Comfortable and steady.',minutes='30',label='EASY SESSION',effort='RPE 2–4 · Full sentences'),b('steps',values=[['05 min','Settle in','Easy walk or very easy jog'],['20 min','Easy run','Keep a conversational effort'],['05 min','Ease out','Finish gently']]),row('Scheduled for 07:00','Calendar event is up to date','calendar-days','calendar'),row('Edit workout','Adjust steps or protect this workout.','sliders-horizontal','editor')
],[button('Prepare this run','pre-run',icon='play')],back='plan')
screen('editor','04 Training','Edit workout','Your changes stay under your control.',[
 field('Workout name','Saturday easy run'),field('Scheduled day','Saturday · 07:00'),b('steps',values=[['05 min','Warm-up','Easy effort'],['20 min','Run','Comfortable effort'],['05 min','Cool-down','Easy effort']]),button('Add a step',None,'secondary','plus'),toggle('Protect this workout','The coach leaves manual edits unchanged.'),text('Total duration · 30 minutes','body','muted')
],[button('Save workout','plan')],back='workout')
screen('coach','04 Training','A steady week ahead','Review proposed changes.',[
 notice('Hold this week steady','Two easy runs felt harder than planned. No extra volume is proposed.','muted'),section('What changes'),row('Tuesday easy run','Keep 30 min · RPE 2–4','check'),row('Thursday easy run','Keep 30 min · RPE 2–4','check'),row('Saturday longer run','35 min → 30 min · Easy effort','arrow-right'),
 section('Why this suggestion'),text('Based on 3 completed runs and 2 effort check-ins. One protected workout stays unchanged.','body','muted'),row('See previous reviews','Accepted, declined and undone changes','activity','coach-history')
],[button('Accept selected changes','coach-accepted'),button('Keep my current plan','plan','secondary')],back='plan')
screen('coach-accepted','04 Training','Plan updated','Your next sessions stay manageable.',[
 b('success',value='A little more breathing room.'),notice('Saturday is now 30 minutes','Only the selected future workout changed. Completed runs and protected workouts are unchanged.'),row('Calendar update pending','Your event will be reconciled.','calendar-days','calendar'),row('Undo this change','Restore the previous future workout.','arrow-left','coach-undo')
],[button('View my plan','plan')],back='coach')
screen('coach-history','04 Training','Plan history','Every change has a reason.',[
 section('This week'),row('Kept next week steady','24 Oct · Accepted · 1 workout adjusted','check','coach-accepted'),section('Earlier'),row('Added 4 easy minutes','17 Oct · Accepted · Good feedback coverage','trending-up','coach'),row('Kept the current plan','10 Oct · Declined · Schedule conflict','calendar-days','coach'),notice('Your manual edits are protected','Changes are reviewed against the latest plan before applying.')
],back='coach')
screen('coach-undo','04 Training','Undo this change?','Review what will be restored.',[
 row('Saturday easy run','30 min → 35 min · Easy effort','arrow-right'),notice('Only future workouts are restored','Your recorded activities stay unchanged. If this workout was edited again, review the conflict before continuing.')
],[button('Undo plan change','plan'),button('Keep the update','coach-accepted','secondary')],back='coach-history')

screen('maps','05 Routes','Maps','A familiar path, ready to follow.',[
 b('map',height=350),b('segments',options=['Saved routes','Personal heatmap'],selected=0,targets=['routes','heatmap']),row('Riverside loop','5.2 km · Saved for offline viewing','route','route-detail'),row('Popular places to run','Open population heatmap in your browser.','layers','population')
],nav='Maps',back=None)
screen('routes','05 Routes','Saved routes','Your own collection.',[
 b('map',height=170),row('Riverside loop','5.2 km · Offline area ready','route','route-detail'),row('Park circuit','3.1 km · Online map','route','route-detail'),row('Sunday out-and-back','7.4 km · Saved geometry','route','route-detail'),notice('A route is a guide','Follow the visible line. Turn-by-turn directions and route generation are outside this release.')
],[button('Choose Riverside loop','pre-run')],back='maps')
screen('route-detail','05 Routes','Riverside loop','Saved from your activity',[
 b('map',height=320,following=True),stats(('5.2','kilometers'),('Loop','route shape')),row('Offline map area','Ready · Saved on this device','download','offline'),row('View source activity','Route, splits and notes','activity','activity')
],[button('Use this route','pre-run')],back='routes')
screen('offline','05 Routes','Take the map along','Riverside loop',[
 b('map',height=270,area=True),row('Selected map area','Around the saved route','map'),row('Estimated download','18 MB · Standard detail','download'),notice('Download before heading out','The app checks provider limits and includes style, font and map resources. Recording works even if a basemap is unavailable.')
],[button('Download selected area','offline-ready'),button('Use route only','pre-run','secondary')],back='route-detail')
screen('offline-ready','05 Routes','Map ready offline','Riverside loop',[
 b('map',height=270),notice('Download complete','Required map resources were checked. This area is stored on your phone.','success'),row('Storage used','18 MB','download'),row('Manage saved areas','Remove areas you no longer need.','map','settings')
],[button('Use this route','pre-run')],back='route-detail')
screen('population','05 Routes','Explore popular paths','Opens an external heatmap.',[
 b('map',height=200,heat=True),notice('Population heatmap','View running, walking or cycling popularity in the provider’s browser experience. Its login and access rules apply.'),text('This app does not embed a population-heatmap API or copy its tiles. Your own activity data is not uploaded by opening the page.','body','muted')
],[button('Open external heatmap',None),button('View my own heatmap','heatmap','secondary')],back='maps',note='External destination is intentionally not opened by the review prototype.')

screen('share','06 Share','Make it yours.','Choose a share-image template.',[
 b('templateGrid'),section('Share what matters'),text('Select a template, then choose the route and numbers you want to include. All templates are available.','body','muted'),row('Route + stats','A transparent outline with your key numbers','route','share-compose'),row('Stats only','Keep your route private','activity','share-stats'),row('Photo + stats','Use a photo from your phone','plus','share-photo')
],[button('Customize route + stats','share-compose')],back='activity')
screen('share-compose','06 Share','Share activity','Route + stats · Transparent',[
 b('sharePreview',template='route',height=320),b('segments',options=['Template','Data','Privacy'],selected=0,targets=['share','share-fields','share-privacy']),row('Story · 9:16','1080 × 1920 PNG','layers','share-preview'),row('Foreground · White','Lime route · Transparent background','sliders-horizontal','share-style')
],[button('Preview export','share-preview')],back='share')
screen('share-fields','06 Share','Choose your data','Only selected fields appear in the image.',[
 b('sharePreview',template='stats',height=220),toggle('Distance','3.84 km'),toggle('Active time','24:18'),toggle('Average pace','6:20 /km'),toggle('Activity title','Saturday easy run',False),toggle('Date','24 October 2026',False),toggle('App name','Optional branding',False)
],[button('Apply selected data','share-compose')],back='share-compose')
screen('share-privacy','06 Share','Protect your route','Preview what leaves your phone.',[
 b('map',height=210,quality='trim'),choice('Trim start and finish','Hide the first and last 200 meters',True),choice('Hide the entire route','Share your numbers only',False,'share-stats'),choice('Show the complete route','May reveal your start and finish'),notice('This only changes the share image','Your original activity stays unchanged. Location names and date are off by default.')
],[button('Apply route privacy','share-compose')],back='share-compose')
screen('share-style','06 Share','Style the image','Keep it readable on any background.',[
 b('sharePreview',template='route',height=240),section('Foreground'),b('swatches',values=['White','Graphite','Lime']),section('Background'),b('segments',options=['Transparent','Solid','Photo'],selected=0,targets=['share-compose','share-stats','share-photo']),notice('Checkerboard means transparent','It is not included in the exported PNG. Preview on light and dark backgrounds before sharing.')
],[button('Apply style','share-compose')],back='share-compose')
screen('share-stats','06 Share','Keep the numbers.','Stats-only template',[
 b('sharePreview',template='stats',height=350),row('Route hidden','No route geometry appears in this image.','shield-check','share-privacy'),row('Choose data','Distance · Time · Average pace','sliders-horizontal','share-fields')
],[button('Preview export','share-preview')],back='share')
screen('share-receipt','06 Share','A small memento.','Receipt template',[
 b('sharePreview',template='receipt',height=350),row('Choose data','Distance · Time · Average pace','sliders-horizontal','share-fields'),row('Change template','Route · Stats · Photo','layers','share')
],[button('Preview export','share-preview')],back='share')
screen('share-photo','06 Share','Your run, your view.','Photo + stats template',[
 b('sharePreview',template='photo',height=330),row('Choose a photo','Android photo picker opens in the app.','plus'),row('Adjust crop and contrast','Keep the numbers legible.','sliders-horizontal','share-style'),notice('Photo metadata is not exported','Only the rendered image and selected fields are included.')
],[button('Preview export','share-preview')],back='share',note='The review uses an original vector landscape, not a personal photo.')
screen('share-preview','06 Share','Ready to share','Story · 1080 × 1920 · PNG',[
 b('sharePreview',template='route',height=360),row('Included','Distance · Active time · Average pace','check'),row('Route privacy','First and last 200 m hidden','shield-check','share-privacy'),text('Receiving apps may flatten transparency. Keep the saved PNG as your original.','small','muted')
],[button('Share image','share-targets',icon='share-2'),button('Save PNG','share-saved','secondary','download')],back='share-compose')
screen('share-targets','06 Share','Share your image','Choose an installed app.',[
 b('sharePreview',template='route',height=220),notice('Android share sheet','Installed destinations appear here in the native app. No public activity link is created.'),row('Instagram','Share image or add to your story.','share-2','share-saved'),row('WhatsApp','Send the image to a contact.','share-2','share-saved'),row('More apps','Use Android’s installed destinations.','plus','share-saved')
],[button('Back to image','share-preview','secondary')],back='share-preview',note='Conceptual handoff; no message is sent and no external app is opened.')
screen('share-saved','06 Share','Image ready','Your selected data, your choice.',[
 b('success',value='Ready for your story.'),b('sharePreview',template='route',height=260),notice('Original PNG saved','In the implemented app, saving uses your selected device destination. This review does not write an activity image to your gallery.')
],[button('Back to activity','activity')],back='share-preview')
screen('strava','06 Share','Take your run\nto Strava.','Manual GPX export',[
 b('routeArt',height=140),notice('A file you control','Export a timestamped GPX file, then select it on Strava’s upload page. No subscription or developer connection is used by this app.'),
 row('Included in GPX','Accepted route points and timestamps','route'),notice('A GPX file contains location','The activity export may contain the complete route. Share-image trimming does not automatically trim this file.','warning')
],[button('Export GPX file',None),button('Back to activity','activity','secondary')],back='activity',note='File export and upload are future app behavior; this review does not upload data.')

screen('settings','07 Settings','Settings','A personal app. Your preferences.',[
 row('Appearance','Dark · Light · System','sun','appearance'),row('Units and privacy','Kilometers · Route privacy defaults','shield-check','privacy'),row('Workout cues','Voice and interval feedback','volume-2','cues'),row('Calendar','Personal calendar connected','calendar-days','calendar'),row('Backup and restore','Last backup · 23 October','download','backup'),row('Activity import','Preview GPX files','file-up','import'),row('Shoes','Mileage and retired shoes','footprints','shoes'),row('About this app','Local storage · No account or ads','activity','about')
],back='today')
screen('appearance','07 Settings','Appearance','Choose what feels clear.',[
 b('themePreview'),choice('Dark','Graphite with a lime accent',True,'today'),choice('Light','Soft white with deep ink',False,'today-light'),choice('Use system setting','Follow Android appearance'),toggle('Reduce motion','Gentle fades and instant data updates.'),notice('Outdoor readability','Test both themes in daylight and keep your display brightness comfortable.')
],[button('Save appearance','settings')],back='settings')
screen('privacy','07 Settings','Units and privacy','Defaults for your personal journal.',[
 field('Distance','Kilometers'),field('Pace','Minutes per kilometer'),field('Week starts','Monday'),section('Share-image defaults'),toggle('Trim route endpoints','Hide first and last 200 meters.'),toggle('Show activity date','Off unless you choose it.',False),toggle('Show location names','Off unless you choose it.',False),notice('Your saved activity stays complete','Exported images use a separate privacy-trimmed copy.')
],[button('Save preferences','settings')],back='settings')
screen('cues','07 Settings','Workout cues','A little guidance, when you want it.',[
 toggle('Voice cues','Announce workout steps and milestones.'),field('Distance updates','Every 1 kilometer'),field('Voice language','English · Offline voice'),toggle('Vibration feedback','Start, pause and interval transitions.'),toggle('Keep screen on','Higher battery use.',False),notice('If no offline voice is available','Use tones and vibration. A voice download is never started silently.')
],[button('Save cue settings','settings')],back='settings')
screen('calendar','07 Settings','Your calendar','Choose where workouts appear.',[
 notice('You stay in control','Only events linked to your workouts are created or updated. Other calendar events are not replaced.'),choice('Personal','Writable calendar · Device account',True),choice('Training','Writable calendar · Local'),row('Preview scheduled workouts','Review before publishing.','calendar-days','calendar-preview'),row('One event needs review','The calendar time changed outside this app.','triangle-alert','calendar-conflict')
],[button('Preview calendar events','calendar-preview'),button('Continue without calendar','plan','secondary')],back='settings')
screen('calendar-preview','07 Settings','Review your schedule','3 workouts · Personal calendar',[
 row('Tuesday easy run','27 Oct · 07:00–07:30','calendar-days','workout'),row('Thursday easy run','29 Oct · 07:00–07:30','calendar-days','workout'),row('Saturday easy run','31 Oct · 07:00–07:30','calendar-days','workout'),field('Reminder','15 minutes before'),notice('Calendar sync uses your device','Your calendar app handles Google or Samsung account synchronization.')
],[button('Publish these workouts','plan')],back='calendar')
screen('calendar-conflict','07 Settings','Which time works?','Saturday easy run changed in your calendar.',[
 choice('Keep calendar time','Saturday · 08:00–08:30',True),choice('Use plan time','Saturday · 07:00–07:30'),notice('One workout, one event','Resolve the difference before the app updates the linked calendar entry. Other events stay untouched.')
],[button('Keep 08:00 calendar time','plan'),button('Review workout','editor','secondary')],back='calendar')
screen('backup','07 Settings','Keep a copy.','Your history deserves a second home.',[
 b('success',value='Last backup\n23 October'),row('What is included','Runs, routes, plans and check-ins','shield-check'),row('Create a backup','Choose a destination you trust.','download','backup-ready'),row('Restore from a backup','Preview and validate before replacing data.','file-up','restore'),toggle('Backup reminders','Occasional reminders on this device.'),notice('Exports contain personal data','Backups are unencrypted in this release. Store them in a trusted location.','warning')
],[button('Create backup','backup-ready')],back='settings')
screen('backup-ready','07 Settings','Backup created','Keep the file somewhere trusted.',[
 b('success',value='A second copy.\nA little peace of mind.'),row('Included records','12 activities · 2 routes · 1 program','check'),row('Backup integrity','Manifest and checksums verified','shield-check'),notice('Test a restore occasionally','A valid file is useful only if you can recover it. Your current app data was not changed.')
],[button('Back to backup settings','backup')],back='backup',note='Illustrative success state, not a claim that a real archive was created.')
screen('restore','07 Settings','Restore your history','Review the backup before continuing.',[
 row('Selected backup','running-backup-2026-10-23.zip','file-up'),stats(('12','activities'),('2','routes'),('1','program')),notice('Validation passed','Supported format, record counts and file checksums are valid.','success'),notice('This replaces current local data','A safety backup is created first. Device-specific calendar links are reconnected afterward.','warning')
],[button('Restore this backup','restored'),button('Choose another file','backup','secondary')],back='backup')
screen('restored','07 Settings','History restored','Ready to pick up where you left off.',[
 b('success',value='Welcome back\nto your miles.'),stats(('12','activities'),('2','routes')),notice('Reconnect your calendar','Device event links are not portable. Review your chosen calendar before publishing again.'),row('Review restored activities','Your history is available locally.','activity','history')
],[button('Go to Today','today')],back='backup')
screen('restore-error','07 Settings','This backup\ncannot be restored.','Your current data is unchanged.',[
 notice('File validation failed','The archive is incomplete or a checksum does not match. Choose another backup or export a fresh copy from the original device.','warning'),row('Current history is safe','No replacement was performed.','shield-check')
],[button('Choose another backup','restore'),button('Back to settings','settings','secondary')],back='backup')
screen('about','07 Settings','Made for your run.','Running Tracker · Design review',[
 b('routeArt',height=180),text('A quiet place for routes, routine and progress.','headline'),row('Data storage','On your phone · Manual backup','shield-check'),row('Maps','MapLibre + OpenFreeMap · Attribution shown','map'),notice('Review prototype','All values and route drawings are illustrative. No location, calendar, sharing or medical service runs in this design review.')
],back='settings')

screen('heatmap','08 Personal history','Your well-worn paths','Personal activity frequency',[
 b('segments',options=['Month','Year','All time'],selected=0),b('map',height=330,heat=True),b('legend'),stats(('10','activities'),('48.2','kilometers')),text('Brighter paths mean more of your activities passed here. This is your history, not population popularity.','small','muted'),row('Import older activities','Add GPX history with duplicate checks.','file-up','import')
],nav='Maps',back='maps',note='Following-release feature. Local activity frequency; schematic route data.')
screen('import','08 Personal history','Bring your history.','Import GPX activity files.',[
 b('routeArt',height=160),row('Choose GPX files','Use Android’s system file picker.','file-up','import-review'),notice('Review before saving','We check format, timestamps and duplicate fingerprints. A repeated file never creates another copy.'),text('Original sources are retained in the activity record. Imported runs with insufficient data do not count as coaching evidence.','body','muted')
],[button('Choose files','import-review')],back='settings',note='Following-release feature. No user files are read by the review.')
screen('import-review','08 Personal history','Review your imports','3 files checked · 1 ready to add',[
 choice('Sunday easy run','New · 5.2 km · 32:14',True),notice('Tuesday run · Duplicate','Already in your journal. This file will be skipped.'),notice('Park run · Invalid timestamps','Cannot import as an activity. Check the original file.','warning'),text('Only the selected valid activity will be added. Existing activities are unchanged.','body','muted')
],[button('Import 1 activity','history')],back='import',note='Following-release feature.')
screen('shoes','08 Personal history','Your shoes','A simple mileage log.',[
 stats(('2','active pairs'),('413','total kilometers')),row('Daily trainers','286 km · Default for easy runs','footprints','shoe-detail'),row('Lightweight pair','127 km · Used for intervals','footprints','shoe-detail'),section('Retired'),row('Previous trainers','612 km · Retired in August','footprints','shoe-detail'),notice('Reminders are your choice','Mileage is a log, not a medical replacement rule.')
],[button('Add a pair','shoe-edit',icon='plus')],back='settings',note='Following-release feature.')
screen('shoe-detail','08 Personal history','Daily trainers','Active pair',[
 b('shoeArt'),stats(('286','kilometers'),('38','activities')),row('Last used','Saturday easy run · 3.84 km','route','activity'),field('Mileage reminder','600 km · Adjustable'),row('Edit this pair','Name, starting mileage and default use','sliders-horizontal','shoe-edit'),row('Retire these shoes','Keep the history attached to past runs.','footprints','shoes')
],[button('Use as default pair','shoes')],back='shoes',note='Following-release feature.')
screen('shoe-edit','08 Personal history','Add your shoes','Give each pair a place in your journal.',[
 field('Name','Daily trainers'),field('Starting mileage','0 km'),field('Optional mileage reminder','600 km'),toggle('Use for new runs','You can change shoes on each activity.'),text('Retiring a pair never removes its mileage or activity history.','body','muted')
],[button('Save pair','shoes')],back='shoes',note='Following-release feature.')

screen('loading','09 Edge states','Progress','Opening your local journal…',[
 b('skeleton'),notice('Loading saved activities','Charts appear after the local records are ready. Recording controls remain independently available.')
],nav='Progress',back=None)
screen('storage-error','09 Edge states','Recording needs\nmore space.','Your last saved checkpoint is preserved.',[
 notice('Storage write failed','Recording has paused because new samples could not be saved. Free device space, then retry or save the partial run.','warning'),stats(('24:18','last saved active time'),('3.84','saved kilometers')),
 text('The app does not keep pretending to record when it cannot save your run.','body','muted')
],[button('Retry saving','paused'),button('Save partial run','finish','secondary')],back=None)
screen('map-unavailable','09 Edge states','Route-only view','Basemap unavailable',[
 b('map',height=330,routeOnly=True),notice('Your route is still here','Map resources are unavailable. GPS recording and saved route geometry work independently of the basemap.'),row('Offline areas','Check saved map resources.','download','offline')
],[button('Continue with route','pre-run')],back='maps')
screen('coach-missing','09 Edge states','No change for now.','Your plan stays as it is.',[
 notice('More feedback would help','Two check-ins are missing and one run has a GPS gap. Unknown data is not treated as an easy run.'),row('Complete a check-in','Tell the coach how the run felt.','activity','check-in'),row('Edit the plan yourself','Your manual builder is always available.','calendar-days','editor'),text('This is an explanation of local rules, not an injury or health assessment.','body','muted')
],[button('Keep my plan','plan')],back='coach')
screen('calendar-denied','09 Edge states','Keep planning here.','Calendar access is unavailable.',[
 notice('Your in-app plan still works','No calendar events were changed. You can grant access later or export a schedule file for manual import.'),row('Review calendar access','Choose a writable calendar.','calendar-days','calendar'),row('Export schedule file','ICS for manual calendar import','download')
],[button('View my plan','plan')],back='settings')
screen('share-empty','09 Edge states','Choose something\nto share.','No fields or route selected.',[
 b('sharePreview',template='empty',height=320),notice('Add at least one item','Choose a number, a title or a visible route. Export becomes available when the image contains something.'),row('Choose data','Distance, time, pace and more','sliders-horizontal','share-fields')
],[button('Choose share data','share-fields')],back='share-compose')

# Theme and accessibility counterparts reuse the same content structure.
for original in ['today','plan','pre-run','maps','progress']:
    source=next(s for s in screens if s['id']==original)
    copy=json.loads(json.dumps(source));copy.update(id=original+'-light',group='10 Light theme',theme='light',note='Light-theme counterpart; same product hierarchy.')
    screens.append(copy)
source=next(s for s in screens if s['id']=='today')
copy=json.loads(json.dumps(source));copy.update(id='today-compact',group='11 Accessibility',width=320,note='Compact 320-pixel review. Content scrolls above the persistent action area.');screens.append(copy)
screen('large-text','11 Accessibility','Ready to run','Large-text review',[
 text('Easy run','headline'),text('30 minutes · Comfortable effort','body'),notice('GPS ready','Your location is precise enough to begin. All essential controls remain reachable.'),row('Choose a saved route','Riverside loop','route','routes')
],[button('Start recording','record'),button('Back to Today','today','secondary')],back='today',note='Large text at 200% in the browser review; native Android font-scale testing is still required.')

palette={
 'dark':{'background':'#101416','surface':'#1B2124','raised':'#252D31','text':'#F3F5EF','muted':'#ADB8BD','subtle':'#7F8E95','line':'#37434A','strong':'#74848C','accent':'#D2F77A','onAccent':'#142019','accentText':'#D2F77A','blue':'#A0CDF3','warning':'#F4D58A','error':'#FFAEAF','mapLand':'#192522','mapRoad':'#46584F','mapWater':'#172E38'},
 'light':{'background':'#F4F6F1','surface':'#FFFFFF','raised':'#E8EDE5','text':'#18221C','muted':'#526359','subtle':'#617369','line':'#D0D8CE','strong':'#71836F','accent':'#D2F77A','onAccent':'#142019','accentText':'#355A17','blue':'#225F8C','warning':'#765312','error':'#9E343B','mapLand':'#E0E9DC','mapRoad':'#B2C4AC','mapWater':'#C7DFE7'}}

data={'version':2,'status':'candidate for owner review','baseWidth':400,'baseHeight':900,'fonts':{'ui':'Manrope','numbers':'Roboto Condensed'},'palette':palette,'screens':screens}
(OUT/'screens.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf8')
icons={p.stem:p.read_text(encoding='utf8') for p in (ROOT/'design/assets/icons').glob('*.svg')}
(ROOT/'.work/design-review/icons.json').write_text(json.dumps(icons),encoding='utf8')
ids={s['id'] for s in screens};assert len(ids)==len(screens)
def targets(obj):
 if isinstance(obj,dict):
  for k,v in obj.items():
   if k in ('target','back') and v:yield v
   elif k=='targets':yield from v
   else:yield from targets(v)
 elif isinstance(obj,list):
  for v in obj:yield from targets(v)
assert set(targets(screens))<=ids, set(targets(screens))-ids
lines=['# UI and UX frame inventory','','Candidate revision 2. All content is illustrative. Review before Android implementation.','',f'{len(screens)} frames cover the agreed features, edge states, light theme and accessibility layouts.','','| ID | Frame | Flow |','| --- | --- | --- |']
lines += [f"| `{s['id']}` | {s['title'].replace(chr(10),' ')} | {s['group']} |" for s in screens]
(OUT/'inventory.md').write_text('\n'.join(lines)+'\n',encoding='utf8')
print(f'Authored {len(screens)} frames across {len(set(s["group"] for s in screens))} groups; navigation targets verified.')
