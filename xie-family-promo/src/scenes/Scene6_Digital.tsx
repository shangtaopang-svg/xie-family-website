import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence, interpolateColors } from "remotion";
import { VILLAGE_PHOTOS, TEMPLE_PHOTOS } from "../assets";
import { Subtitle } from "../components/Subtitle";

export const Scene6Digital: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneDuration = 600; // 20s (90-110s overall)

  // Screen mockup with scrolling effect
  const scrollY = interpolate(frame, [0, 600], [0, -600], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade for website screenshot parts
  const opacity1 = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity2 = interpolate(frame, [200, 230], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity3 = interpolate(frame, [400, 430], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#0d1117" }}>
      {/* Modern tech background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, rgba(251,146,60,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content area - Website showcase */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          height: 500,
          border: "1px solid rgba(251,146,60,0.3)",
          borderRadius: 12,
          overflow: "hidden",
          background: "rgba(13,17,23,0.9)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Browser bar */}
        <div style={{ height: 36, background: "#161b22", display: "flex", alignItems: "center", padding: "0 12px", gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
          <div
            style={{
              flex: 1,
              textAlign: "center",
              color: "rgba(255,255,255,0.4)",
              fontSize: 11,
              fontFamily: "monospace",
            }}
          >
            xie-family.cn
          </div>
        </div>

        {/* Scrolling website content */}
        <div
          style={{
            transform: `translateY(${scrollY}px)`,
          }}
        >
          {/* Section 1: Navigation mockup */}
          <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", gap: 24, color: "rgba(255,255,255,0.6)", fontSize: 13, opacity: opacity1 }}>
            <span style={{ color: "#fb923c" }}>首页</span>
            <span>家族历史</span>
            <span>族谱查询</span>
            <span>名人事迹</span>
            <span>联系我们</span>
          </div>

          {/* Section 2: Hero area */}
          <div
            style={{
              height: 200,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              opacity: opacity1,
            }}
          >
            <div style={{ fontSize: 36, color: "#fb923c", fontFamily: "serif", fontWeight: 700 }}>
              乌衣世泽 · 宝树家声
            </div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
              宁海下枫槎村 · 谢氏家族数字宗祠
            </div>
          </div>

          {/* Section 3: Genealogy Tree */}
          <div style={{ opacity: opacity2, padding: "20px 40px" }}>
            <div style={{ fontSize: 16, color: "#fb923c", marginBottom: 12, fontFamily: "serif" }}>🌳 世系图谱</div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 8,
            }}>
              {["谢小四", "文杲公", "攒公", "撰公", "彬公", "乾公"].map((name) => (
                <div
                  key={name}
                  style={{
                    padding: "8px 12px",
                    border: "1px solid rgba(251,146,60,0.3)",
                    borderRadius: 6,
                    textAlign: "center",
                    color: "#fff",
                    fontSize: 13,
                    background: "rgba(251,146,60,0.08)",
                  }}
                >
                  {name}
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Map */}
          <div style={{ opacity: opacity3, padding: "20px 40px" }}>
            <div style={{ fontSize: 16, color: "#fb923c", marginBottom: 12, fontFamily: "serif" }}>🗺️ 迁徙路线</div>
            <div
              style={{
                height: 120,
                background: "rgba(255,255,255,0.05)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                padding: "0 20px",
                fontSize: 11,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              <span>河南谢邑</span>
              <span style={{ color: "#fb923c" }}>→</span>
              <span>东山会稽</span>
              <span style={{ color: "#fb923c" }}>→</span>
              <span>临海下渡</span>
              <span style={{ color: "#fb923c" }}>→</span>
              <span>石马</span>
              <span style={{ color: "#fb923c" }}>→</span>
              <span>宁海岩下</span>
              <span style={{ color: "#fb923c" }}>→</span>
              <span>下枫槎</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtitle */}
      <Subtitle
        text="我们把族谱搬上云端。四海宗亲，虽隔山海，一触即连。"
        startFrame={30}
        duration={570}
      />
    </AbsoluteFill>
  );
};
