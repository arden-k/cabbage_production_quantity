// 샘플 데이터
const data = [
  {
    size: 195298 / 10000,
    color: "#EB6548",
    x: 104 + 30,
    y: 399.5,
    label: "195,298 톤",
    des: "2010년대 고랭지 평균 배추 생산량",
    textColor: "#EB6548",
  },
  {
    size: 3027787 / 10000,
    color: "#6B9A6E",
    x: 265 + 30,
    y: 260,
    label: "3,027,787 톤",
    des: "1980년대 평균 배추 생산량",
    textColor: "#6B9A6E",
  },
  {
    size: 2243967 / 10000,
    color: "#EB6548",
    x: 415 + 30,
    y: 488.3,
    label: "2,243,967 톤",
    des: "2010년대 평균 배추 생산량",
    textColor: "#EB6548",
  },
  {
    size: 322061 / 10000,
    color: "#6B9A6E",
    x: 543 + 30,
    y: 377.5,
    label: "322,061 톤",
    des: "1990년대 평균 고랭지 배추 생산량",
    textColor: "#6B9A6E",
  },
];

const data2 = [195298, 3027787, 2243967, 322061];

const svg = d3
  .select("svg")
  .attr("viewBox", "0 0 500 500") // 초기 viewBox 설정
  .attr("preserveAspectRatio", "xMidYMid meet");

// 정삼각형의 높이 계산 함수
function getHeight(size) {
  return (size * Math.sqrt(3)) / 2;
}

// 각 삼각형에 그룹 생성
const triangles = svg
  .selectAll("g")
  .data(data)
  .enter()
  .append("g")
  .attr("transform", (d, i) => {
    // 삼각형 위치 지정 및 양쪽 끝 삼각형 회전
    const x = d.x;
    const y = d.y;
    // 첫 번째와 마지막 삼각형은 180도 회전
    const rotate = i === 0 || i === data.length - 2 ? "rotate(180)" : "";
    return `translate(${x}, ${y}) ${rotate}`;
  });

// 각 그룹에 정삼각형 추가
triangles
  .append("path")
  .attr("d", (d) => {
    const h = getHeight(d.size);
    const s = d.size;
    return `M0,${-h / 2} L${s / 2},${h / 2} L${-s / 2},${h / 2} Z`;
  })
  .attr("fill", (d) => d.color);

// 각 삼각형 꼭대기에 텍스트 추가
triangles
  .append("text")
  .attr("x", 0) // x 좌표는 삼각형의 중심
  .attr("y", (d) => -getHeight(d.size) / 2 - 10) // y 좌표는 꼭대기보다 위로 약간 띄움
  .attr("text-anchor", "middle") // 텍스트를 중앙에 맞춤
  .attr("font-family", "Open Sans") // 폰트 변경
  .attr("font-size", "24px") // 폰트 크기
  .attr("font-weight", "bold") // 볼드체로 설정
  .attr("fill", (d) => d.textColor) // 각 데이터의 textColor 속성을 사용하여 색상 설정
  .attr("transform", (d, i) => {
    // 첫 번째와 마지막 삼각형(역삼각형)은 텍스트만 다시 반대로 회전하되 위치는 다시 조정
    return i === 0 || i === data.length - 2
      ? `rotate(180) translate(0, ${getHeight(d.size) + 40})` // 회전 후 y 좌표를 위로 이동
      : "";
  })
  .text((d) => d.label); // 각 삼각형마다 다른 텍스트를 표시

// 각 삼각형 꼭대기에 설명 텍스트 추가
triangles
  .append("text")
  .attr("x", 0) // x 좌표는 삼각형의 중심
  .attr("y", (d) => -getHeight(d.size) / 2 - 40) // y 좌표는 꼭대기보다 위로 약간 띄움
  .attr("text-anchor", "middle") // 텍스트를 중앙에 맞춤
  .attr("font-family", "Open Sans") // 폰트 변경
  .attr("font-size", "16px") // 폰트 크기
  .attr("fill", (d) => d.textColor) // 각 데이터의 textColor 속성을 사용하여 색상 설정
  .attr("transform", (d, i) => {
    // 첫 번째와 마지막 삼각형(역삼각형)은 텍스트만 다시 반대로 회전하되 위치는 다시 조정
    return i === 0 || i === data.length - 2
      ? `rotate(180) translate(0, ${getHeight(d.size) + 97})` // 회전 후 y 좌표를 위로 이동
      : "";
  })
  .text((d) => d.des); // 각 삼각형마다 다른 텍스트를 표시

let zoomCount = 0; // 줌인/줌아웃 횟수를 저장하는 변수

// 카메라 이동 및 줌인/줌아웃 애니메이션
function cameraTransition(index) {
  const triangle = data[index];
  const viewBoxWidth = 700;
  const viewBoxHeight = 700;
  const zoomFactor = 0.5; // 줌인 비율
  const zoomDuration = 2000; // 줌인/줌아웃 시간

  // 삼각형 높이를 계산
  const triangleHeight = getHeight(triangle.size);

  svg
    .transition()
    .duration(zoomDuration)
    .attr("viewBox", function () {
      if (index === 2) {
        // 세 번째 역삼각형일 경우 특별한 좌표 지정
        return `${triangle.x - (viewBoxWidth * zoomFactor) / 2} ${
          triangle.y + triangleHeight / 2 - (viewBoxHeight * zoomFactor) / 2
        } ${viewBoxWidth * zoomFactor} ${viewBoxHeight * zoomFactor}`;
      } else {
        // 나머지 삼각형들은 기존 좌표 사용
        return `${triangle.x - (viewBoxWidth * zoomFactor) / 2} ${
          triangle.y - triangleHeight / 2 - (viewBoxHeight * zoomFactor) / 2
        } ${viewBoxWidth * zoomFactor} ${viewBoxHeight * zoomFactor}`;
      }
    })
    .on("end", function () {
      // 줌아웃 애니메이션
      svg
        .transition()
        .duration(zoomDuration)
        .attr("viewBox", "0 0 700 700")
        .on("end", function () {
          if (zoomCount < data.length - 1) {
            zoomCount++;
            // 다음 삼각형으로 카메라 이동
            if (index < data.length - 1) {
              cameraTransition(index + 1);
            } else cameraTransition(0);
          }
        });
    });
}

// 첫 번째 삼각형부터 카메라 이동 시작
cameraTransition(1);
