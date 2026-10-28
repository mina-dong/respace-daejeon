// app.js 전체를 이 코드로 싹 덮어씌워 주세요!
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. 대전 중심부 기준으로 지도 생성
    const map = L.map('map', { zoomControl: false });

    const bounds = L.latLngBounds(
        spaceData.map(space => space.coords)
    );

    map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 14
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // 2. 지도 스킨 로드
    L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors'
        }
      ).addTo(map);

    // 사이드바 레이아웃 때문에 깨진 지도 크기를 강제로 리프레시-정상화처리
    setTimeout(() => {
        map.invalidateSize();
    }, 100);

    // 3. UI 바인딩 및 지도 마커 렌더링
    const cardContainer = document.getElementById('cardContainer');

    // data.js에서 spaceData를 정상적으로 가져왔는지 검증
    if (cardContainer && typeof spaceData !== 'undefined') {
        spaceData.forEach((space) => {
            // 지도에 핀 꽂기
            const marker = L.marker(space.coords).addTo(map);
            
            // 마커 클릭 시 팝업 템플릿
            const popupHTML = `
                <div class="popup-card">
                    <div class="popup-tag">#${space.type}</div>
                    <div class="popup-title">${space.name}</div>
                    <div class="popup-desc">${space.desc}</div>
                </div>
            `;
            marker.bindPopup(popupHTML);

            // 사이드바 목록 카드 생성
            const card = document.createElement('div');
            card.className = 'space-card';
            card.innerHTML = `
                <h3>${space.name}</h3>
                <div class="address">📍 ${space.address}</div>
                <div class="tag-container">
                    <span class="tag space-type">${space.type}</span>
                    <span class="tag status">● ${space.status}</span>
                </div>
            `;
            
            // 카드 클릭 인터랙션
            card.addEventListener('click', () => {
                map.setView(space.coords, 15, { animate: true, duration: 0.6 });
                marker.openPopup();
            });

            cardContainer.appendChild(card);
        });
    }
});
