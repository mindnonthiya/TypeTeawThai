import React from 'react'

export type ProfileTrait =
    | 'nature'
    | 'cafe'
    | 'adventure'
    | 'culture'
    | 'sea'

type Props = {
    story: string
    topProvince?: {
        name_th?: string
        name_en?: string
    }
    lang: string
    trait?: ProfileTrait | null
    className?: string
}

export default function ShareCard({
    story,
    topProvince,
    lang,
    trait,
    className,
}: Props) {
    const imageMap: Record<ProfileTrait, string> = {
        nature: '/images/nature.png',
        cafe: '/images/cafe.png',
        adventure: '/images/adventure.png',
        culture: '/images/culture.png',
        sea: '/images/sea.png',
    }

    const imgSrc = trait ? imageMap[trait] : null

    return (
        <div
            className={className}
            style={{
                width: 620,
                height: 1400,
                padding: '100px 70px 80px',
                background: '#f4efe8',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: '#2d2a26',
                boxSizing: 'border-box',
            }}
        >
            {/* CONTENT BLOCK */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    width: '100%',
                    marginTop: 40,
                }}
            >
                {/* STORY */}
                <div
                    style={{
                        fontSize: 26,          // 🔥 เล็กลงชัดเจน
                        lineHeight: 1.8,       // 🔥 ชิดขึ้น
                        marginBottom: 100,      // 🔥 ลดช่องว่างก่อน province
                        letterSpacing: 0.2,
                        whiteSpace: 'pre-line',
                        maxWidth: 560,
                    }}
                >
                    {story}
                </div>

                {/* PROVINCE SECTION (fixed layout) */}
                {topProvince && (
                    <div
                        style={{
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginBottom: 70,
                        }}
                    >
                        <div
                            style={{
                                fontSize: 16,
                                color: '#8c857c',
                                marginBottom: 12,
                            }}
                        >
                            {lang === 'th'
                                ? 'จังหวัดที่เหมาะกับคุณที่สุดคือ'
                                : 'The province that fits you best is'}
                        </div>

                        <div
                            style={{
                                fontSize: 58,
                                fontWeight: 600,
                                color: '#dc5e5e',
                                maxWidth: 560,
                                lineHeight: 1.15,
                                textAlign: 'center',
                            }}
                        >
                            {lang === 'th'
                                ? topProvince.name_th
                                : topProvince.name_en}
                        </div>

                        {/* BEST MATCH overlay แบบคุมตำแหน่งเอง */}
                        <div
                            style={{
                                fontSize: 12,
                                letterSpacing: 4,
                                marginTop: 14,   // 🔥 ให้ระยะห่างแทน absolute
                            }}
                        >
                            BEST MATCH
                        </div>
                    </div>
                )}

                {/* TRAIT IMAGE */}
                {imgSrc && (
                    <img
                        src={imgSrc}
                        alt={trait || ''}
                        style={{
                            width: 460,
                            objectFit: 'contain',
                            marginTop: 10,   // 🔥 คุมระยะใหม่
                        }}
                    />
                )}
            </div>

            {/* BRAND */}
            <div
                style={{
                    fontSize: 14,
                    letterSpacing: 6,
                    opacity: 0.8,
                    marginTop: 100,
                }}
            >
                TYPETEAWTHAI
            </div>
        </div>
    )
}
