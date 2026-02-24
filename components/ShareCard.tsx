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
    className?: string   // 👈 เพิ่มอันนี้

}

export default function ShareCard({
    story,
    topProvince,
    lang,
    trait,
    className,  // 👈 รับเพิ่ม

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
                padding: 120,
                background: '#f4efe8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2d2a26',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    maxWidth: 720,
                }}
            >
                {/* STORY */}
                <div
                    style={{
                        fontSize: 30,
                        lineHeight: 2,
                        marginBottom: 70,
                        letterSpacing: 0.3,
                        whiteSpace: 'pre-line',
                        maxWidth: 620,
                    }}
                >
                    {story}
                </div>

                {/* BEST MATCH */}
                {topProvince && (
                    <>
                        <div
                            style={{
                                fontSize: 18,
                                opacity: 0.6,
                                marginBottom: 14,
                                letterSpacing: 1,
                            }}
                        >
                            {lang === 'th'
                                ? 'จังหวัดที่เหมาะกับคุณที่สุดคือ'
                                : 'The province that fits you best is'}
                        </div>

                        <div
                            style={{
                                fontSize: 48,
                                fontWeight: 600,
                                marginBottom: 6,
                                color: '#d54242',
                            }}
                        >
                            {lang === 'th'
                                ? topProvince.name_th
                                : topProvince.name_en}
                        </div>

                        <div
                            style={{
                                fontSize: 12,
                                letterSpacing: 3,
                                marginBottom: 40,
                            }}
                        >
                            BEST MATCH
                        </div>

                        {/* TRAIT IMAGE */}
                        {imgSrc && (
                            <img
                                src={imgSrc}
                                alt={trait || ''}
                                style={{
                                    width: 420,
                                    marginBottom: 80,
                                }}
                            />
                        )}
                    </>
                )}

                {/* BRAND */}
                <div
                    style={{
                        fontSize: 14,
                        letterSpacing: 4,
                        marginTop: 70,
                    }}
                >
                    TYPETEAWTHAI
                </div>
            </div>
        </div>
    )
}