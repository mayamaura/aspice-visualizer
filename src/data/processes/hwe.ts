import type { Process } from '../../types/aspice'

export const HWE_PROCESSES: Process[] = [
  {
    id: 'HWE.1',
    name: {
      en: 'Hardware Requirements Analysis',
      ja: 'ハードウェア要件分析',
    },
    group: 'HWE',
    purpose: {
      en: 'The purpose of the Hardware Requirements Analysis Process is to transform the hardware related parts of the system requirements into a set of hardware requirements.',
      ja: 'ハードウェア要件分析プロセスの目的は、システム要件のハードウェア関連部分を、ハードウェア要件の集合に変換することである。',
    },
    outcomes: [
      {
        id: 'HWE.1.1',
        description: {
          en: 'The hardware requirements, including interfaces, are defined.',
          ja: 'インターフェースを含むハードウェア要件が定義されている。',
        },
      },
      {
        id: 'HWE.1.2',
        description: {
          en: 'Hardware requirements are categorised and analysed for correctness and testability.',
          ja: 'ハードウェア要件が分類され、正確性とテスト可能性について分析されている。',
        },
      },
      {
        id: 'HWE.1.3',
        description: {
          en: 'Consistency and bilateral traceability are established between hardware requirements and system requirements.',
          ja: 'ハードウェア要件とシステム要件の間で、一貫性および双方向トレーサビリティが確立されている。',
        },
      },
      {
        id: 'HWE.1.4',
        description: {
          en: 'Hardware requirements are agreed and communicated to all affected parties.',
          ja: 'ハードウェア要件が合意され、影響を受けるすべての関係者に伝達されている。',
        },
      },
    ],
    basePractices: [
      {
        id: 'HWE.1.BP1',
        name: { en: 'Specify hardware requirements', ja: 'ハードウェア要件を規定する' },
        description: {
          en: 'Use the system requirements and the system architecture as the basis for hardware requirements. Specify functional and non-functional hardware requirements for each hardware component identified in the system architecture, including interfaces.',
          ja: 'システム要件とシステムアーキテクチャをハードウェア要件の基礎として使用する。システムアーキテクチャで識別された各ハードウェアコンポーネントに対して、インターフェースを含む機能的および非機能的ハードウェア要件を規定する。',
        },
        supportsOutcomes: ['HWE.1.1'],
        outputs: [{ itemId: 'HWE-17-01' }],
        inputs: [{ itemId: '17-11' }, { itemId: '04-07' }],
      },
      {
        id: 'HWE.1.BP2',
        name: { en: 'Analyse hardware requirements', ja: 'ハードウェア要件を分析する' },
        description: {
          en: 'Analyse the specified hardware requirements to ensure correctness, completeness, unambiguity, consistency, and testability.',
          ja: '規定されたハードウェア要件を分析し、正確性、完全性、明確性、一貫性、テスト可能性を確保する。',
        },
        supportsOutcomes: ['HWE.1.2'],
        outputs: [{ itemId: 'HWE-17-01' }],
        inputs: [],
      },
      {
        id: 'HWE.1.BP3',
        name: { en: 'Establish traceability', ja: 'トレーサビリティを確立する' },
        description: {
          en: 'Establish bilateral traceability between hardware requirements and system requirements.',
          ja: 'ハードウェア要件とシステム要件の間で双方向トレーサビリティを確立する。',
        },
        supportsOutcomes: ['HWE.1.3'],
        outputs: [{ itemId: '15-01' }],
        inputs: [{ itemId: '17-11' }],
      },
      {
        id: 'HWE.1.BP4',
        name: { en: 'Communicate agreed hardware requirements', ja: '合意されたハードウェア要件を伝達する' },
        description: {
          en: 'Communicate the agreed hardware requirements to all affected parties.',
          ja: '合意されたハードウェア要件を影響を受けるすべての関係者に伝達する。',
        },
        supportsOutcomes: ['HWE.1.4'],
        outputs: [],
        inputs: [],
      },
    ],
    outputItems: [
      {
        id: 'HWE-17-01',
        name: { en: 'Hardware Requirements Specification', ja: 'ハードウェア要件仕様' },
        characteristics: [
          { en: 'Functional requirements', ja: '機能要件' },
          { en: 'Non-functional requirements', ja: '非機能要件' },
          { en: 'Interface requirements', ja: 'インターフェース要件' },
        ],
      },
    ],
  },
  {
    id: 'HWE.2',
    name: {
      en: 'Hardware Architectural Design',
      ja: 'ハードウェアアーキテクチャ設計',
    },
    group: 'HWE',
    purpose: {
      en: 'The purpose of the Hardware Architectural Design Process is to establish a hardware architectural design and to identify which hardware requirements are to be allocated to which elements of the hardware.',
      ja: 'ハードウェアアーキテクチャ設計プロセスの目的は、ハードウェアアーキテクチャ設計を確立し、どのハードウェア要件をハードウェアのどの要素に割り当てるかを識別することである。',
    },
    outcomes: [
      {
        id: 'HWE.2.1',
        description: {
          en: 'A hardware architectural design is defined that identifies the elements of the hardware.',
          ja: 'ハードウェアの要素を識別するハードウェアアーキテクチャ設計が定義されている。',
        },
      },
      {
        id: 'HWE.2.2',
        description: {
          en: 'Hardware requirements are allocated to the elements of the hardware architecture.',
          ja: 'ハードウェア要件がハードウェアアーキテクチャの要素に割り当てられている。',
        },
      },
      {
        id: 'HWE.2.3',
        description: {
          en: 'Interfaces between hardware elements and with external entities are defined.',
          ja: 'ハードウェア要素間および外部エンティティとのインターフェースが定義されている。',
        },
      },
      {
        id: 'HWE.2.4',
        description: {
          en: 'Consistency and bilateral traceability are established between the hardware requirements and the hardware architectural design.',
          ja: 'ハードウェア要件とハードウェアアーキテクチャ設計の間で、一貫性および双方向トレーサビリティが確立されている。',
        },
      },
    ],
    basePractices: [
      {
        id: 'HWE.2.BP1',
        name: { en: 'Develop hardware architectural design', ja: 'ハードウェアアーキテクチャ設計を開発する' },
        description: {
          en: 'Develop a hardware architectural design that identifies the major elements of the hardware and describes their responsibilities, characteristics and interactions.',
          ja: 'ハードウェアの主要な要素を識別し、その責務、特性、相互作用を記述するハードウェアアーキテクチャ設計を開発する。',
        },
        supportsOutcomes: ['HWE.2.1'],
        outputs: [{ itemId: 'HWE-04-01' }],
        inputs: [{ itemId: 'HWE-17-01' }],
      },
      {
        id: 'HWE.2.BP2',
        name: { en: 'Allocate hardware requirements', ja: 'ハードウェア要件を割り当てる' },
        description: {
          en: 'Allocate all hardware requirements to the elements of the hardware architecture.',
          ja: 'すべてのハードウェア要件をハードウェアアーキテクチャの要素に割り当てる。',
        },
        supportsOutcomes: ['HWE.2.2'],
        outputs: [{ itemId: 'HWE-04-01' }],
        inputs: [{ itemId: 'HWE-17-01' }],
      },
      {
        id: 'HWE.2.BP3',
        name: { en: 'Define interfaces of hardware elements', ja: 'ハードウェア要素のインターフェースを定義する' },
        description: {
          en: 'Identify, define and document the interfaces of each hardware element and external interfaces.',
          ja: '各ハードウェア要素のインターフェースおよび外部インターフェースを識別、定義、文書化する。',
        },
        supportsOutcomes: ['HWE.2.3'],
        outputs: [{ itemId: 'HWE-04-01' }],
        inputs: [],
      },
      {
        id: 'HWE.2.BP4',
        name: { en: 'Establish traceability', ja: 'トレーサビリティを確立する' },
        description: {
          en: 'Establish bilateral traceability between hardware requirements and the hardware architectural design.',
          ja: 'ハードウェア要件とハードウェアアーキテクチャ設計の間で双方向トレーサビリティを確立する。',
        },
        supportsOutcomes: ['HWE.2.4'],
        outputs: [{ itemId: '15-01' }],
        inputs: [{ itemId: 'HWE-17-01' }],
      },
    ],
    outputItems: [
      {
        id: 'HWE-04-01',
        name: { en: 'Hardware Architectural Design', ja: 'ハードウェアアーキテクチャ設計' },
        characteristics: [
          { en: 'Hardware elements and responsibilities', ja: 'ハードウェア要素と責務' },
          { en: 'Interface definitions', ja: 'インターフェース定義' },
          { en: 'Requirements allocation', ja: '要件の割り当て' },
        ],
      },
    ],
  },
  {
    id: 'HWE.3',
    name: {
      en: 'Hardware Detailed Design',
      ja: 'ハードウェア詳細設計',
    },
    group: 'HWE',
    purpose: {
      en: 'The purpose of the Hardware Detailed Design Process is to provide a detailed design for the hardware items based on the hardware architectural design.',
      ja: 'ハードウェア詳細設計プロセスの目的は、ハードウェアアーキテクチャ設計に基づいてハードウェアアイテムの詳細設計を提供することである。',
    },
    outcomes: [
      {
        id: 'HWE.3.1',
        description: {
          en: 'A detailed design is defined for each hardware item that describes its implementation.',
          ja: '各ハードウェアアイテムの実装を記述した詳細設計が定義されている。',
        },
      },
      {
        id: 'HWE.3.2',
        description: {
          en: 'Consistency and bilateral traceability are established between hardware architectural design and hardware detailed design.',
          ja: 'ハードウェアアーキテクチャ設計とハードウェア詳細設計の間で、一貫性および双方向トレーサビリティが確立されている。',
        },
      },
      {
        id: 'HWE.3.3',
        description: {
          en: 'The hardware detailed design is agreed and communicated to all affected parties.',
          ja: 'ハードウェア詳細設計が合意され、影響を受けるすべての関係者に伝達されている。',
        },
      },
    ],
    basePractices: [
      {
        id: 'HWE.3.BP1',
        name: { en: 'Develop hardware detailed design', ja: 'ハードウェア詳細設計を開発する' },
        description: {
          en: 'Develop a detailed design for each hardware item defined in the hardware architectural design.',
          ja: 'ハードウェアアーキテクチャ設計で定義された各ハードウェアアイテムの詳細設計を開発する。',
        },
        supportsOutcomes: ['HWE.3.1'],
        outputs: [{ itemId: 'HWE-18-01' }],
        inputs: [{ itemId: 'HWE-04-01' }],
      },
      {
        id: 'HWE.3.BP2',
        name: { en: 'Establish traceability', ja: 'トレーサビリティを確立する' },
        description: {
          en: 'Establish bilateral traceability between hardware architectural design and hardware detailed design.',
          ja: 'ハードウェアアーキテクチャ設計とハードウェア詳細設計の間で双方向トレーサビリティを確立する。',
        },
        supportsOutcomes: ['HWE.3.2'],
        outputs: [{ itemId: '15-01' }],
        inputs: [{ itemId: 'HWE-04-01' }],
      },
      {
        id: 'HWE.3.BP3',
        name: { en: 'Communicate agreed hardware detailed design', ja: '合意されたハードウェア詳細設計を伝達する' },
        description: {
          en: 'Communicate the agreed hardware detailed design to all affected parties.',
          ja: '合意されたハードウェア詳細設計を影響を受けるすべての関係者に伝達する。',
        },
        supportsOutcomes: ['HWE.3.3'],
        outputs: [],
        inputs: [],
      },
    ],
    outputItems: [
      {
        id: 'HWE-18-01',
        name: { en: 'Hardware Detailed Design', ja: 'ハードウェア詳細設計' },
        characteristics: [
          { en: 'Implementation details for each hardware item', ja: '各ハードウェアアイテムの実装詳細' },
          { en: 'Schematics and layout', ja: '回路図とレイアウト' },
        ],
      },
    ],
  },
  {
    id: 'HWE.4',
    name: {
      en: 'Hardware Integration and Integration Test',
      ja: 'ハードウェア統合および統合テスト',
    },
    group: 'HWE',
    purpose: {
      en: 'The purpose of the Hardware Integration and Integration Test Process is to integrate the hardware items into a complete hardware consistent with the hardware architectural design, and to ensure that the integrated hardware items are tested to provide evidence for compliance with the hardware architectural design.',
      ja: 'ハードウェア統合および統合テストプロセスの目的は、ハードウェアアーキテクチャ設計と一貫した形でハードウェアアイテムを統合して完全なハードウェアを構築し、統合されたハードウェアアイテムがハードウェアアーキテクチャ設計への準拠の証拠を提供するためにテストされることを確保することである。',
    },
    outcomes: [
      {
        id: 'HWE.4.1',
        description: {
          en: 'A hardware integration strategy consistent with the hardware architectural design is developed.',
          ja: 'ハードウェアアーキテクチャ設計と一貫したハードウェア統合戦略が開発されている。',
        },
      },
      {
        id: 'HWE.4.2',
        description: {
          en: 'Hardware items are integrated according to the integration strategy.',
          ja: 'ハードウェアアイテムが統合戦略に従って統合されている。',
        },
      },
      {
        id: 'HWE.4.3',
        description: {
          en: 'Integrated hardware items are tested using the defined integration test criteria.',
          ja: '統合されたハードウェアアイテムが定義された統合テスト基準を用いてテストされている。',
        },
      },
      {
        id: 'HWE.4.4',
        description: {
          en: 'Results of hardware integration test are recorded.',
          ja: 'ハードウェア統合テストの結果が記録されている。',
        },
      },
    ],
    basePractices: [
      {
        id: 'HWE.4.BP1',
        name: { en: 'Develop hardware integration strategy', ja: 'ハードウェア統合戦略を開発する' },
        description: {
          en: 'Develop a strategy for integration of hardware items consistent with the hardware architectural design.',
          ja: 'ハードウェアアーキテクチャ設計と一貫したハードウェアアイテムの統合戦略を開発する。',
        },
        supportsOutcomes: ['HWE.4.1'],
        outputs: [{ itemId: 'HWE-11-01' }],
        inputs: [{ itemId: 'HWE-04-01' }],
      },
      {
        id: 'HWE.4.BP2',
        name: { en: 'Integrate hardware items', ja: 'ハードウェアアイテムを統合する' },
        description: {
          en: 'Integrate hardware items according to the integration strategy.',
          ja: '統合戦略に従ってハードウェアアイテムを統合する。',
        },
        supportsOutcomes: ['HWE.4.2'],
        outputs: [{ itemId: 'HWE-14-01' }],
        inputs: [{ itemId: 'HWE-18-01' }, { itemId: 'HWE-11-01' }],
      },
      {
        id: 'HWE.4.BP3',
        name: { en: 'Perform hardware integration test', ja: 'ハードウェア統合テストを実施する' },
        description: {
          en: 'Test integrated hardware items using the hardware integration test specification.',
          ja: 'ハードウェア統合テスト仕様を用いて統合されたハードウェアアイテムをテストする。',
        },
        supportsOutcomes: ['HWE.4.3'],
        outputs: [{ itemId: '13-04' }],
        inputs: [{ itemId: 'HWE-14-01' }, { itemId: 'HWE-11-01' }],
      },
      {
        id: 'HWE.4.BP4',
        name: { en: 'Record hardware integration test results', ja: 'ハードウェア統合テスト結果を記録する' },
        description: {
          en: 'Record the hardware integration test results including pass/fail status.',
          ja: 'パス/フェイルのステータスを含むハードウェア統合テスト結果を記録する。',
        },
        supportsOutcomes: ['HWE.4.4'],
        outputs: [{ itemId: '13-04' }],
        inputs: [],
      },
    ],
    outputItems: [
      {
        id: 'HWE-11-01',
        name: { en: 'Hardware Integration Test Specification', ja: 'ハードウェア統合テスト仕様' },
        characteristics: [
          { en: 'Integration test cases', ja: '統合テストケース' },
          { en: 'Integration strategy', ja: '統合戦略' },
        ],
      },
      {
        id: 'HWE-14-01',
        name: { en: 'Integrated Hardware', ja: '統合済みハードウェア' },
        characteristics: [
          { en: 'Hardware items integrated per architecture', ja: 'アーキテクチャに従い統合されたハードウェアアイテム' },
        ],
      },
    ],
  },
  {
    id: 'HWE.5',
    name: {
      en: 'Hardware Qualification Test',
      ja: 'ハードウェア適格性確認テスト',
    },
    group: 'HWE',
    purpose: {
      en: 'The purpose of the Hardware Qualification Test Process is to ensure that the integrated hardware is tested to provide evidence for compliance of the hardware with the hardware requirements.',
      ja: 'ハードウェア適格性確認テストプロセスの目的は、統合されたハードウェアがハードウェア要件に準拠していることの証拠を提供するためにテストされることを確保することである。',
    },
    outcomes: [
      {
        id: 'HWE.5.1',
        description: {
          en: 'A hardware qualification test strategy including regression test strategy is developed.',
          ja: 'リグレッションテスト戦略を含むハードウェア適格性確認テスト戦略が開発されている。',
        },
      },
      {
        id: 'HWE.5.2',
        description: {
          en: 'Hardware qualification test criteria are defined based on the hardware requirements.',
          ja: 'ハードウェア適格性確認テスト基準がハードウェア要件に基づいて定義されている。',
        },
      },
      {
        id: 'HWE.5.3',
        description: {
          en: 'The integrated hardware is tested using the defined hardware qualification test criteria.',
          ja: '統合されたハードウェアが定義されたハードウェア適格性確認テスト基準を用いてテストされている。',
        },
      },
      {
        id: 'HWE.5.4',
        description: {
          en: 'Results of the hardware qualification test are recorded.',
          ja: 'ハードウェア適格性確認テストの結果が記録されている。',
        },
      },
    ],
    basePractices: [
      {
        id: 'HWE.5.BP1',
        name: { en: 'Develop hardware qualification test strategy', ja: 'ハードウェア適格性確認テスト戦略を開発する' },
        description: {
          en: 'Develop a strategy for hardware qualification testing including regression test strategy.',
          ja: 'リグレッションテスト戦略を含むハードウェア適格性確認テスト戦略を開発する。',
        },
        supportsOutcomes: ['HWE.5.1'],
        outputs: [{ itemId: 'HWE-11-02' }],
        inputs: [{ itemId: 'HWE-17-01' }],
      },
      {
        id: 'HWE.5.BP2',
        name: { en: 'Develop hardware qualification test specification', ja: 'ハードウェア適格性確認テスト仕様を開発する' },
        description: {
          en: 'Develop hardware qualification test specification including test cases based on the hardware requirements.',
          ja: 'ハードウェア要件に基づいたテストケースを含むハードウェア適格性確認テスト仕様を開発する。',
        },
        supportsOutcomes: ['HWE.5.2'],
        outputs: [{ itemId: 'HWE-11-02' }],
        inputs: [{ itemId: 'HWE-17-01' }],
      },
      {
        id: 'HWE.5.BP3',
        name: { en: 'Perform hardware qualification test', ja: 'ハードウェア適格性確認テストを実施する' },
        description: {
          en: 'Test the integrated hardware using the hardware qualification test specification.',
          ja: 'ハードウェア適格性確認テスト仕様を用いて統合されたハードウェアをテストする。',
        },
        supportsOutcomes: ['HWE.5.3'],
        outputs: [{ itemId: '13-04' }],
        inputs: [{ itemId: 'HWE-14-01' }, { itemId: 'HWE-11-02' }],
      },
      {
        id: 'HWE.5.BP4',
        name: { en: 'Record hardware qualification test results', ja: 'ハードウェア適格性確認テスト結果を記録する' },
        description: {
          en: 'Record the hardware qualification test results including pass/fail status.',
          ja: 'パス/フェイルのステータスを含むハードウェア適格性確認テスト結果を記録する。',
        },
        supportsOutcomes: ['HWE.5.4'],
        outputs: [{ itemId: '13-04' }],
        inputs: [],
      },
    ],
    outputItems: [
      {
        id: 'HWE-11-02',
        name: { en: 'Hardware Qualification Test Specification', ja: 'ハードウェア適格性確認テスト仕様' },
        characteristics: [
          { en: 'Test cases based on hardware requirements', ja: 'ハードウェア要件に基づくテストケース' },
          { en: 'Regression test strategy', ja: 'リグレッションテスト戦略' },
        ],
      },
    ],
  },
]
