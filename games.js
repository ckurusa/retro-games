// 게임 목록. 새 게임은 games/<id>/ 폴더를 만들고 여기에 한 항목만 추가하면 허브에 카드가 생긴다.
// hiKey: 허브 카드에 보여 줄 하이스코어의 localStorage 키 (없으면 생략), hiLabel: 표시 문구
window.GAMES = [
  {
    id: 'jaenmal-hanpan',
    title: '잰말놀이 한판',
    desc: '회전판을 돌려 규칙을 정하고, 카드를 뽑아 잰말을 소리 내어 말하는 온 가족 보드게임',
    path: 'games/jaenmal-hanpan/jaenmal-hanpan.html',
    icon: '🎡',
    colors: ['#FFC933', '#FF7EB6'],
    tags: ['가족', '파티', '잰말'],
    isNew: true,
    hiKey: 'retro_jaenmal-hanpan_hi',
    hiLabel: (v) => (v && v.best ? `한 판 최고 ${v.best}점` : '')
  },
  {
    id: 'tadak-dungeon',
    title: '타닥타닥 던전',
    desc: '몬스터를 물리치며 키우는 한글 타자 실력. 낱말 배틀, 책 읽기, 스피드런까지',
    path: 'games/tadak-dungeon/tadak-dungeon.html',
    icon: '⌨️',
    colors: ['#7c5cff', '#22d3ee'],
    tags: ['타자', '액션', '교육'],
    isNew: true,
    hiKey: 'retro_tadak-dungeon_hi',
    hiLabel: (v) => `낱말 배틀 최고 ${Number(v).toLocaleString()}점`
  },
  {
    id: 'mine-search',
    title: '마인서치',
    desc: '클래식·러시·콤보 3가지 모드로 즐기는 네온 지뢰찾기. 연속으로 안전하게 열수록 점수 ×8',
    path: 'games/mine-search/mine-search.html',
    icon: '💣',
    colors: ['#22e6ff', '#ff3df2'],
    tags: ['퍼즐', '지뢰찾기', '콤보'],
    isNew: true,
    hiKey: 'retro_mine-search_hi',
    hiLabel: (v) => (v && v.combo ? `콤보 최고 ${Number(v.combo).toLocaleString()}점` : v && v.rush ? `러시 최고 ${Number(v.rush).toLocaleString()}점` : v && v.classic ? `클래식 최고 ${v.classic}초` : '')
  },
  {
    id: 'neon-smash',
    title: '네온 스매시',
    desc: '벽돌을 이어서 깰수록 점수 배율이 ×8까지! 콤보를 노리는 네온 벽돌깨기',
    path: 'games/neon-smash/neon-smash.html',
    icon: '🧱',
    colors: ['#ff3df2', '#22e6ff'],
    tags: ['아케이드', '벽돌깨기', '콤보'],
    isNew: true,
    hiKey: 'retro_neon-smash_hi',
    hiLabel: (v) => `최고 ${Number(v).toLocaleString()}점`
  }
];
