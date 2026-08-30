# 약국 디펜스

한국 동네 약국을 배경으로 한 5레인 캐주얼 타워디펜스 MVP입니다.

## 실행
```bash
npm install
npm run dev
```

## 구현 완료
- Phaser 3 + TypeScript + Vite
- 모바일 가로형 FIT 스케일
- 5×9 터치 그리드 / 5개 레인
- 6개 방어 유닛: 기본약, 영양제, 밴드, 파스, 연고, 강공격
- 매출 자원, 자동수익, 영양제 추가수익
- 적 스폰/이동/방어유닛 접촉 공격
- 투사체/피해/감속/회복/사망
- 3 Wave, 난이도 증가, 라이프, 게임오버, 클리어
- 일시정지 및 터치 UI

## Sprite 제작 규칙
- 완전 투명(alpha) PNG
- 한 캐릭터의 모든 프레임은 동일 canvas 크기
- pivot/anchor는 bottom-center (0.5, 1.0)
- 모든 프레임의 발 위치 고정: 애니메이션 jitter 방지
- 그림자, 투사체, 공격/피격 이펙트는 캐릭터 sprite와 분리
- Defender 상태: Idle / Attack / Hit / Death
- Enemy 상태: Walk / Attack / Hit / Death

현재 캐릭터는 placeholder입니다. 정식 sprite가 들어와도 게임 좌표와 전투 로직을 다시 작성하지 않고 교체할 수 있도록 유지합니다.

## 확장 방향
정식 애니메이션 sprite, 다양한 진상/의사/영업사원 적, 약사 액티브 스킬, 추가 스테이지, 건물주 보스, 사운드 및 저장 시스템을 추가합니다.
