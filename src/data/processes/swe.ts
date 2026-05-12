import type { Process } from '../../types/aspice'

export const SWE_PROCESSES: Process[] = [
  {
    id: 'SWE.1',
    name: {
      en: 'Software Requirements Analysis',
      ja: 'ソフトウェア要件分析',
    },
    group: 'SWE',
    purpose: {
      en: 'The purpose of the Software Requirements Analysis Process is to transform the software related parts of the system requirements into a set of software requirements.',
      ja: 'ソフトウェア要件分析プロセスの目的は、システム要件のソフトウェア関連部分を、ソフトウェア要件の集合に変換することである。',
    },
    outcomes: [
      {
        id: 'SWE.1.1',
        description: {
          en: 'The software requirements, including interfaces, are defined.',
          ja: 'インターフェースを含むソフトウェア要件が定義されている。',
        },
      },
      {
        id: 'SWE.1.2',
        description: {
          en: 'Software requirements are categorized and analysed for correctness and testability.',
          ja: 'ソフトウェア要件が分類され、正確性とテスト可能性について分析されている。',
        },
      },
      {
        id: 'SWE.1.3',
        description: {
          en: 'The impact of software requirements on the operating environment is analysed.',
          ja: 'ソフトウェア要件が動作環境に与える影響が分析されている。',
        },
      },
      {
        id: 'SWE.1.4',
        description: {
          en: 'Consistency and bilateral traceability are established between software requirements and system requirements.',
          ja: 'ソフトウェア要件とシステム要件の間で、一貫性および双方向トレーサビリティが確立されている。',
        },
      },
      {
        id: 'SWE.1.5',
        description: {
          en: 'Software requirements are agreed and communicated to all affected parties.',
          ja: 'ソフトウェア要件が合意され、影響を受けるすべての関係者に伝達されている。',
        },
      },
    ],
    basePractices: [
      {
        id: 'SWE.1.BP1',
        name: { en: 'Specify software requirements', ja: 'ソフトウェア要件を規定する' },
        description: {
          en: 'Use the system requirements and the system architecture as the basis for software requirements. Specify functional and non-functional software requirements for each software component identified in the system architecture, including interfaces.',
          ja: 'システム要件とシステムアーキテクチャをソフトウェア要件の基礎として使用する。システムアーキテクチャで識別された各ソフトウェアコンポーネントに対して、インターフェースを含む機能的および非機能的ソフトウェア要件を規定する。',
        },
        supportsOutcomes: ['SWE.1.1'],
        outputs: [{ itemId: '17-08' }],
        inputs: [{ itemId: '17-11' }, { itemId: '04-06' }],
      },
      {
        id: 'SWE.1.BP2',
        name: { en: 'Structure software requirements', ja: 'ソフトウェア要件を構造化する' },
        description: {
          en: 'Structure the software requirements in a hierarchical manner according to the software components of the system architecture.',
          ja: 'システムアーキテクチャのソフトウェアコンポーネントに従い、ソフトウェア要件を階層的に構造化する。',
        },
        supportsOutcomes: ['SWE.1.1'],
        outputs: [{ itemId: '17-08' }],
        inputs: [{ itemId: '04-06' }],
      },
      {
        id: 'SWE.1.BP3',
        name: { en: 'Analyse software requirements', ja: 'ソフトウェア要件を分析する' },
        description: {
          en: 'Analyse the specified software requirements including their interdependencies to ensure that they are correct, complete, unambiguous, consistent and testable.',
          ja: '規定されたソフトウェア要件を相互依存関係を含めて分析し、正確性、完全性、明確性、一貫性、テスト可能性を確保する。',
        },
        supportsOutcomes: ['SWE.1.2'],
        outputs: [{ itemId: '17-08' }],
        inputs: [],
      },
      {
        id: 'SWE.1.BP4',
        name: { en: 'Analyse impact on operating environment', ja: '動作環境への影響を分析する' },
        description: {
          en: 'Analyse the impact of the software requirements on the operating environment to identify constraints and required capabilities.',
          ja: 'ソフトウェア要件が動作環境に与える影響を分析し、制約および必要な機能を識別する。',
        },
        supportsOutcomes: ['SWE.1.3'],
        outputs: [{ itemId: '17-08' }],
        inputs: [],
      },
      {
        id: 'SWE.1.BP5',
        name: { en: 'Establish traceability', ja: 'トレーサビリティを確立する' },
        description: {
          en: 'Establish bilateral traceability between software requirements and system requirements. Ensure consistency between software requirements and system requirements.',
          ja: 'ソフトウェア要件とシステム要件の間で双方向トレーサビリティを確立する。ソフトウェア要件とシステム要件の間の一貫性を確保する。',
        },
        supportsOutcomes: ['SWE.1.4'],
        outputs: [{ itemId: '15-01' }],
        inputs: [{ itemId: '17-11' }],
      },
      {
        id: 'SWE.1.BP6',
        name: { en: 'Communicate agreed software requirements', ja: '合意されたソフトウェア要件を伝達する' },
        description: {
          en: 'Communicate the agreed software requirements to all affected parties.',
          ja: '合意されたソフトウェア要件を影響を受けるすべての関係者に伝達する。',
        },
        supportsOutcomes: ['SWE.1.5'],
        outputs: [],
        inputs: [],
      },
    ],
    outputItems: [
      {
        id: '17-08',
        name: { en: 'Software Requirements Specification', ja: 'ソフトウェア要件仕様' },
        characteristics: [
          { en: 'Functional requirements', ja: '機能要件' },
          { en: 'Non-functional requirements', ja: '非機能要件' },
          { en: 'Interface requirements', ja: 'インターフェース要件' },
        ],
      },
      {
        id: '15-01',
        name: { en: 'Traceability Record', ja: 'トレーサビリティ記録' },
        characteristics: [
          { en: 'Bidirectional traceability links', ja: '双方向トレーサビリティリンク' },
        ],
      },
    ],
  },
  {
    id: 'SWE.2',
    name: {
      en: 'Software Architectural Design',
      ja: 'ソフトウェアアーキテクチャ設計',
    },
    group: 'SWE',
    purpose: {
      en: 'The purpose of the Software Architectural Design Process is to establish an architectural design and to identify which software requirements are to be allocated to which elements of the software.',
      ja: 'ソフトウェアアーキテクチャ設計プロセスの目的は、アーキテクチャ設計を確立し、どのソフトウェア要件をソフトウェアのどの要素に割り当てるかを識別することである。',
    },
    outcomes: [
      {
        id: 'SWE.2.1',
        description: {
          en: 'A software architectural design is defined that identifies the elements of the software.',
          ja: 'ソフトウェアの要素を識別するソフトウェアアーキテクチャ設計が定義されている。',
        },
      },
      {
        id: 'SWE.2.2',
        description: {
          en: 'All software requirements are allocated to the elements of the software architecture.',
          ja: 'すべてのソフトウェア要件がソフトウェアアーキテクチャの要素に割り当てられている。',
        },
      },
      {
        id: 'SWE.2.3',
        description: {
          en: 'Interfaces between software elements and with external entities are defined.',
          ja: 'ソフトウェア要素間および外部エンティティとのインターフェースが定義されている。',
        },
      },
      {
        id: 'SWE.2.4',
        description: {
          en: 'Consistency and bilateral traceability are established between the software requirements and the software architectural design.',
          ja: 'ソフトウェア要件とソフトウェアアーキテクチャ設計の間で、一貫性および双方向トレーサビリティが確立されている。',
        },
      },
      {
        id: 'SWE.2.5',
        description: {
          en: 'The software architectural design is agreed and communicated to all affected parties.',
          ja: 'ソフトウェアアーキテクチャ設計が合意され、影響を受けるすべての関係者に伝達されている。',
        },
      },
    ],
    basePractices: [
      {
        id: 'SWE.2.BP1',
        name: { en: 'Define software architecture', ja: 'ソフトウェアアーキテクチャを定義する' },
        description: {
          en: 'Define a top-level software architecture that identifies the major elements of the software. Describe the responsibilities, characteristics and interactions of each element.',
          ja: 'ソフトウェアの主要な要素を識別するトップレベルのソフトウェアアーキテクチャを定義する。各要素の責務、特性、相互作用を記述する。',
        },
        supportsOutcomes: ['SWE.2.1'],
        outputs: [{ itemId: '04-06' }],
        inputs: [{ itemId: '17-08' }],
      },
      {
        id: 'SWE.2.BP2',
        name: { en: 'Allocate software requirements', ja: 'ソフトウェア要件を割り当てる' },
        description: {
          en: 'Allocate all software requirements to the elements of the software architecture.',
          ja: 'すべてのソフトウェア要件をソフトウェアアーキテクチャの要素に割り当てる。',
        },
        supportsOutcomes: ['SWE.2.2'],
        outputs: [{ itemId: '04-06' }],
        inputs: [{ itemId: '17-08' }],
      },
      {
        id: 'SWE.2.BP3',
        name: { en: 'Define interfaces of software elements', ja: 'ソフトウェア要素のインターフェースを定義する' },
        description: {
          en: 'Identify, define and document the interfaces of each software element and external interfaces.',
          ja: '各ソフトウェア要素のインターフェースおよび外部インターフェースを識別、定義、文書化する。',
        },
        supportsOutcomes: ['SWE.2.3'],
        outputs: [{ itemId: '04-06' }],
        inputs: [],
      },
      {
        id: 'SWE.2.BP4',
        name: { en: 'Describe dynamic behaviour', ja: '動的振る舞いを記述する' },
        description: {
          en: 'Evaluate and document the dynamic behaviour of the interaction between the software elements.',
          ja: 'ソフトウェア要素間の相互作用の動的振る舞いを評価し、文書化する。',
        },
        supportsOutcomes: ['SWE.2.1'],
        outputs: [{ itemId: '04-06' }],
        inputs: [],
      },
      {
        id: 'SWE.2.BP5',
        name: { en: 'Establish traceability', ja: 'トレーサビリティを確立する' },
        description: {
          en: 'Establish bilateral traceability between software requirements and the software architectural design.',
          ja: 'ソフトウェア要件とソフトウェアアーキテクチャ設計の間で双方向トレーサビリティを確立する。',
        },
        supportsOutcomes: ['SWE.2.4'],
        outputs: [{ itemId: '15-01' }],
        inputs: [{ itemId: '17-08' }],
      },
      {
        id: 'SWE.2.BP6',
        name: { en: 'Communicate agreed software architectural design', ja: '合意されたソフトウェアアーキテクチャ設計を伝達する' },
        description: {
          en: 'Communicate the agreed software architectural design to all affected parties.',
          ja: '合意されたソフトウェアアーキテクチャ設計を影響を受けるすべての関係者に伝達する。',
        },
        supportsOutcomes: ['SWE.2.5'],
        outputs: [],
        inputs: [],
      },
    ],
    outputItems: [
      {
        id: '04-06',
        name: { en: 'Software Architectural Design', ja: 'ソフトウェアアーキテクチャ設計' },
        characteristics: [
          { en: 'Software elements and their responsibilities', ja: 'ソフトウェア要素とその責務' },
          { en: 'Interface definitions', ja: 'インターフェース定義' },
          { en: 'Dynamic behaviour description', ja: '動的振る舞いの記述' },
          { en: 'Requirements allocation', ja: '要件の割り当て' },
        ],
      },
    ],
  },
  {
    id: 'SWE.3',
    name: {
      en: 'Software Detailed Design and Unit Construction',
      ja: 'ソフトウェア詳細設計およびユニット構築',
    },
    group: 'SWE',
    purpose: {
      en: 'The purpose of the Software Detailed Design and Unit Construction Process is to provide a detailed design for the software units based on the software architectural design and to produce the source code for the software units.',
      ja: 'ソフトウェア詳細設計およびユニット構築プロセスの目的は、ソフトウェアアーキテクチャ設計に基づいてソフトウェアユニットの詳細設計を提供し、ソフトウェアユニットのソースコードを作成することである。',
    },
    outcomes: [
      {
        id: 'SWE.3.1',
        description: {
          en: 'A detailed design is defined for each software unit that describes the data structures, algorithms, and control flows.',
          ja: 'データ構造、アルゴリズム、制御フローを記述した詳細設計が各ソフトウェアユニットに定義されている。',
        },
      },
      {
        id: 'SWE.3.2',
        description: {
          en: 'Interfaces between software units and with external entities are defined.',
          ja: 'ソフトウェアユニット間および外部エンティティとのインターフェースが定義されている。',
        },
      },
      {
        id: 'SWE.3.3',
        description: {
          en: 'Consistency and bilateral traceability are established between the software architectural design and the software detailed design.',
          ja: 'ソフトウェアアーキテクチャ設計とソフトウェア詳細設計の間で、一貫性および双方向トレーサビリティが確立されている。',
        },
      },
      {
        id: 'SWE.3.4',
        description: {
          en: 'Source code is produced that implements each software unit according to the software detailed design.',
          ja: 'ソフトウェア詳細設計に従って各ソフトウェアユニットを実装するソースコードが作成されている。',
        },
      },
    ],
    basePractices: [
      {
        id: 'SWE.3.BP1',
        name: { en: 'Develop software detailed design', ja: 'ソフトウェア詳細設計を開発する' },
        description: {
          en: 'Develop a detailed design for each software unit defined in the software architectural design including data structures, algorithms, and control flows.',
          ja: 'ソフトウェアアーキテクチャ設計で定義された各ソフトウェアユニットについて、データ構造、アルゴリズム、制御フローを含む詳細設計を開発する。',
        },
        supportsOutcomes: ['SWE.3.1'],
        outputs: [{ itemId: '18-06' }],
        inputs: [{ itemId: '04-06' }],
      },
      {
        id: 'SWE.3.BP2',
        name: { en: 'Define interfaces of software units', ja: 'ソフトウェアユニットのインターフェースを定義する' },
        description: {
          en: 'Identify, define and document the interfaces of each software unit and external interfaces.',
          ja: '各ソフトウェアユニットのインターフェースおよび外部インターフェースを識別、定義、文書化する。',
        },
        supportsOutcomes: ['SWE.3.2'],
        outputs: [{ itemId: '18-06' }],
        inputs: [],
      },
      {
        id: 'SWE.3.BP3',
        name: { en: 'Establish traceability', ja: 'トレーサビリティを確立する' },
        description: {
          en: 'Establish bilateral traceability between the software architectural design and the software detailed design.',
          ja: 'ソフトウェアアーキテクチャ設計とソフトウェア詳細設計の間で双方向トレーサビリティを確立する。',
        },
        supportsOutcomes: ['SWE.3.3'],
        outputs: [{ itemId: '15-01' }],
        inputs: [{ itemId: '04-06' }],
      },
      {
        id: 'SWE.3.BP4',
        name: { en: 'Produce source code', ja: 'ソースコードを作成する' },
        description: {
          en: 'Produce source code for each software unit based on the software detailed design. Apply coding guidelines.',
          ja: 'ソフトウェア詳細設計に基づいて各ソフトウェアユニットのソースコードを作成する。コーディングガイドラインを適用する。',
        },
        supportsOutcomes: ['SWE.3.4'],
        outputs: [{ itemId: '16-05' }],
        inputs: [{ itemId: '18-06' }],
      },
    ],
    outputItems: [
      {
        id: '18-06',
        name: { en: 'Software Detailed Design', ja: 'ソフトウェア詳細設計' },
        characteristics: [
          { en: 'Data structures', ja: 'データ構造' },
          { en: 'Algorithms', ja: 'アルゴリズム' },
          { en: 'Control flows', ja: '制御フロー' },
        ],
      },
      {
        id: '16-05',
        name: { en: 'Source Code', ja: 'ソースコード' },
        characteristics: [
          { en: 'Compliance with coding guidelines', ja: 'コーディングガイドラインへの準拠' },
          { en: 'Traceability to detailed design', ja: '詳細設計へのトレーサビリティ' },
        ],
      },
    ],
  },
  {
    id: 'SWE.4',
    name: {
      en: 'Software Unit Verification',
      ja: 'ソフトウェアユニット検証',
    },
    group: 'SWE',
    purpose: {
      en: 'The purpose of the Software Unit Verification Process is to verify software units to provide evidence for the compliance of the software units with the software detailed design and with the non-functional software requirements.',
      ja: 'ソフトウェアユニット検証プロセスの目的は、ソフトウェアユニットがソフトウェア詳細設計および非機能ソフトウェア要件に準拠していることの証拠を提供するために、ソフトウェアユニットを検証することである。',
    },
    outcomes: [
      {
        id: 'SWE.4.1',
        description: {
          en: 'A unit verification strategy including regression strategy is developed to verify the software units.',
          ja: 'ソフトウェアユニットを検証するためのリグレッション戦略を含むユニット検証戦略が開発されている。',
        },
      },
      {
        id: 'SWE.4.2',
        description: {
          en: 'Unit verification criteria are defined, based on the software detailed design and the non-functional software requirements.',
          ja: 'ユニット検証基準が、ソフトウェア詳細設計および非機能ソフトウェア要件に基づいて定義されている。',
        },
      },
      {
        id: 'SWE.4.3',
        description: {
          en: 'Software units are verified using the defined unit verification criteria.',
          ja: 'ソフトウェアユニットが、定義されたユニット検証基準を用いて検証されている。',
        },
      },
      {
        id: 'SWE.4.4',
        description: {
          en: 'Results of unit verification are recorded.',
          ja: 'ユニット検証の結果が記録されている。',
        },
      },
    ],
    basePractices: [
      {
        id: 'SWE.4.BP1',
        name: { en: 'Develop unit verification strategy', ja: 'ユニット検証戦略を開発する' },
        description: {
          en: 'Develop a strategy for unit verification including regression strategy. Define the verification methods and tools.',
          ja: 'リグレッション戦略を含むユニット検証戦略を開発する。検証方法とツールを定義する。',
        },
        supportsOutcomes: ['SWE.4.1'],
        outputs: [{ itemId: '19-05' }],
        inputs: [{ itemId: '18-06' }, { itemId: '17-08' }],
      },
      {
        id: 'SWE.4.BP2',
        name: { en: 'Develop unit verification criteria', ja: 'ユニット検証基準を開発する' },
        description: {
          en: 'Develop unit verification criteria to ensure that units fulfil the software detailed design and the non-functional requirements.',
          ja: 'ユニットがソフトウェア詳細設計および非機能要件を満たすことを確保するためのユニット検証基準を開発する。',
        },
        supportsOutcomes: ['SWE.4.2'],
        outputs: [{ itemId: '19-05' }],
        inputs: [{ itemId: '18-06' }],
      },
      {
        id: 'SWE.4.BP3',
        name: { en: 'Verify software units', ja: 'ソフトウェアユニットを検証する' },
        description: {
          en: 'Verify software units using the defined unit verification criteria to confirm compliance with the software detailed design.',
          ja: '定義されたユニット検証基準を用いてソフトウェアユニットを検証し、ソフトウェア詳細設計への準拠を確認する。',
        },
        supportsOutcomes: ['SWE.4.3'],
        outputs: [{ itemId: '13-04' }],
        inputs: [{ itemId: '16-05' }, { itemId: '19-05' }],
      },
      {
        id: 'SWE.4.BP4',
        name: { en: 'Record unit verification results', ja: 'ユニット検証結果を記録する' },
        description: {
          en: 'Record the unit verification results, including pass/fail status and deviations found.',
          ja: 'ユニット検証の結果をパス/フェイルのステータスおよび発見された逸脱を含めて記録する。',
        },
        supportsOutcomes: ['SWE.4.4'],
        outputs: [{ itemId: '13-04' }],
        inputs: [],
      },
    ],
    outputItems: [
      {
        id: '19-05',
        name: { en: 'Unit Verification Specification', ja: 'ユニット検証仕様' },
        characteristics: [
          { en: 'Verification methods', ja: '検証方法' },
          { en: 'Test cases and test data', ja: 'テストケースとテストデータ' },
          { en: 'Regression strategy', ja: 'リグレッション戦略' },
        ],
      },
      {
        id: '13-04',
        name: { en: 'Verification Results', ja: '検証結果' },
        characteristics: [
          { en: 'Pass/fail status', ja: 'パス/フェイルステータス' },
          { en: 'Deviations found', ja: '発見された逸脱' },
          { en: 'Coverage achieved', ja: '達成されたカバレッジ' },
        ],
      },
    ],
  },
  {
    id: 'SWE.5',
    name: {
      en: 'Software Integration and Integration Test',
      ja: 'ソフトウェア統合および統合テスト',
    },
    group: 'SWE',
    purpose: {
      en: 'The purpose of the Software Integration and Integration Test Process is to integrate the software units into larger software items up to a complete integrated software, consistent with the software architectural design, and to ensure that the software items are tested to provide evidence for compliance of the integrated software with the software architectural design.',
      ja: 'ソフトウェア統合および統合テストプロセスの目的は、ソフトウェアアーキテクチャ設計と一貫した形でソフトウェアユニットを統合してソフトウェアアイテムに組み上げ、統合されたソフトウェアがソフトウェアアーキテクチャ設計に準拠していることの証拠を提供するためにソフトウェアアイテムをテストすることである。',
    },
    outcomes: [
      {
        id: 'SWE.5.1',
        description: {
          en: 'A software integration strategy consistent with the software architectural design is developed.',
          ja: 'ソフトウェアアーキテクチャ設計と一貫したソフトウェア統合戦略が開発されている。',
        },
      },
      {
        id: 'SWE.5.2',
        description: {
          en: 'A software integration test strategy including regression test strategy is developed.',
          ja: 'リグレッションテスト戦略を含むソフトウェア統合テスト戦略が開発されている。',
        },
      },
      {
        id: 'SWE.5.3',
        description: {
          en: 'Software units are integrated according to the integration strategy.',
          ja: 'ソフトウェアユニットが統合戦略に従って統合されている。',
        },
      },
      {
        id: 'SWE.5.4',
        description: {
          en: 'Integration test criteria are defined based on the software architectural design.',
          ja: '統合テスト基準がソフトウェアアーキテクチャ設計に基づいて定義されている。',
        },
      },
      {
        id: 'SWE.5.5',
        description: {
          en: 'Integrated software items are tested using the defined integration test criteria.',
          ja: '統合されたソフトウェアアイテムが定義された統合テスト基準を用いてテストされている。',
        },
      },
      {
        id: 'SWE.5.6',
        description: {
          en: 'Consistency and bilateral traceability are established between integration test specification and the software architectural design.',
          ja: '統合テスト仕様とソフトウェアアーキテクチャ設計の間で、一貫性および双方向トレーサビリティが確立されている。',
        },
      },
    ],
    basePractices: [
      {
        id: 'SWE.5.BP1',
        name: { en: 'Develop software integration strategy', ja: 'ソフトウェア統合戦略を開発する' },
        description: {
          en: 'Develop a strategy for integration of software units consistent with the software architectural design.',
          ja: 'ソフトウェアアーキテクチャ設計と一貫したソフトウェアユニットの統合戦略を開発する。',
        },
        supportsOutcomes: ['SWE.5.1'],
        outputs: [{ itemId: '11-06' }],
        inputs: [{ itemId: '04-06' }],
      },
      {
        id: 'SWE.5.BP2',
        name: { en: 'Develop software integration test strategy', ja: 'ソフトウェア統合テスト戦略を開発する' },
        description: {
          en: 'Develop a strategy for integration testing of software including regression test strategy.',
          ja: 'リグレッションテスト戦略を含むソフトウェア統合テスト戦略を開発する。',
        },
        supportsOutcomes: ['SWE.5.2'],
        outputs: [{ itemId: '11-06' }],
        inputs: [{ itemId: '04-06' }],
      },
      {
        id: 'SWE.5.BP3',
        name: { en: 'Integrate software units', ja: 'ソフトウェアユニットを統合する' },
        description: {
          en: 'Integrate software units according to the integration strategy.',
          ja: '統合戦略に従ってソフトウェアユニットを統合する。',
        },
        supportsOutcomes: ['SWE.5.3'],
        outputs: [{ itemId: '14-07' }],
        inputs: [{ itemId: '16-05' }, { itemId: '11-06' }],
      },
      {
        id: 'SWE.5.BP4',
        name: { en: 'Develop software integration test specification', ja: 'ソフトウェア統合テスト仕様を開発する' },
        description: {
          en: 'Develop integration test specification including test cases based on the software architectural design.',
          ja: 'ソフトウェアアーキテクチャ設計に基づいたテストケースを含む統合テスト仕様を開発する。',
        },
        supportsOutcomes: ['SWE.5.4'],
        outputs: [{ itemId: '11-06' }],
        inputs: [{ itemId: '04-06' }],
      },
      {
        id: 'SWE.5.BP5',
        name: { en: 'Perform software integration test', ja: 'ソフトウェア統合テストを実施する' },
        description: {
          en: 'Test integrated software items using the integration test specification.',
          ja: '統合テスト仕様を用いて統合されたソフトウェアアイテムをテストする。',
        },
        supportsOutcomes: ['SWE.5.5'],
        outputs: [{ itemId: '13-04' }],
        inputs: [{ itemId: '14-07' }, { itemId: '11-06' }],
      },
      {
        id: 'SWE.5.BP6',
        name: { en: 'Establish traceability', ja: 'トレーサビリティを確立する' },
        description: {
          en: 'Establish bilateral traceability between integration test specification and the software architectural design.',
          ja: '統合テスト仕様とソフトウェアアーキテクチャ設計の間で双方向トレーサビリティを確立する。',
        },
        supportsOutcomes: ['SWE.5.6'],
        outputs: [{ itemId: '15-01' }],
        inputs: [{ itemId: '04-06' }],
      },
    ],
    outputItems: [
      {
        id: '11-06',
        name: { en: 'Software Integration Test Specification', ja: 'ソフトウェア統合テスト仕様' },
        characteristics: [
          { en: 'Integration test cases', ja: '統合テストケース' },
          { en: 'Integration test data', ja: '統合テストデータ' },
          { en: 'Regression test strategy', ja: 'リグレッションテスト戦略' },
        ],
      },
      {
        id: '14-07',
        name: { en: 'Integrated Software', ja: '統合済みソフトウェア' },
        characteristics: [
          { en: 'Software units integrated per architecture', ja: 'アーキテクチャに従い統合されたソフトウェアユニット' },
        ],
      },
    ],
  },
  {
    id: 'SWE.6',
    name: {
      en: 'Software Qualification Test',
      ja: 'ソフトウェア適格性確認テスト',
    },
    group: 'SWE',
    purpose: {
      en: 'The purpose of the Software Qualification Test Process is to ensure that the integrated software is tested to provide evidence for compliance of the integrated software with the software requirements.',
      ja: 'ソフトウェア適格性確認テストプロセスの目的は、統合されたソフトウェアがソフトウェア要件に準拠していることの証拠を提供するためにテストされることを確保することである。',
    },
    outcomes: [
      {
        id: 'SWE.6.1',
        description: {
          en: 'A software qualification test strategy including regression test strategy is developed.',
          ja: 'リグレッションテスト戦略を含むソフトウェア適格性確認テスト戦略が開発されている。',
        },
      },
      {
        id: 'SWE.6.2',
        description: {
          en: 'Software qualification test criteria are defined based on the software requirements.',
          ja: 'ソフトウェア適格性確認テスト基準がソフトウェア要件に基づいて定義されている。',
        },
      },
      {
        id: 'SWE.6.3',
        description: {
          en: 'The integrated software is tested using the defined software qualification test criteria.',
          ja: '統合されたソフトウェアが定義されたソフトウェア適格性確認テスト基準を用いてテストされている。',
        },
      },
      {
        id: 'SWE.6.4',
        description: {
          en: 'Consistency and bilateral traceability are established between the software qualification test specification and the software requirements.',
          ja: 'ソフトウェア適格性確認テスト仕様とソフトウェア要件の間で、一貫性および双方向トレーサビリティが確立されている。',
        },
      },
      {
        id: 'SWE.6.5',
        description: {
          en: 'Results of the software qualification test are recorded.',
          ja: 'ソフトウェア適格性確認テストの結果が記録されている。',
        },
      },
    ],
    basePractices: [
      {
        id: 'SWE.6.BP1',
        name: { en: 'Develop software qualification test strategy', ja: 'ソフトウェア適格性確認テスト戦略を開発する' },
        description: {
          en: 'Develop a strategy for software qualification testing including regression test strategy.',
          ja: 'リグレッションテスト戦略を含むソフトウェア適格性確認テスト戦略を開発する。',
        },
        supportsOutcomes: ['SWE.6.1'],
        outputs: [{ itemId: '11-07' }],
        inputs: [{ itemId: '17-08' }],
      },
      {
        id: 'SWE.6.BP2',
        name: { en: 'Develop software qualification test specification', ja: 'ソフトウェア適格性確認テスト仕様を開発する' },
        description: {
          en: 'Develop software qualification test specification including test cases based on the software requirements.',
          ja: 'ソフトウェア要件に基づいたテストケースを含むソフトウェア適格性確認テスト仕様を開発する。',
        },
        supportsOutcomes: ['SWE.6.2'],
        outputs: [{ itemId: '11-07' }],
        inputs: [{ itemId: '17-08' }],
      },
      {
        id: 'SWE.6.BP3',
        name: { en: 'Perform software qualification test', ja: 'ソフトウェア適格性確認テストを実施する' },
        description: {
          en: 'Test the integrated software using the software qualification test specification.',
          ja: 'ソフトウェア適格性確認テスト仕様を用いて統合されたソフトウェアをテストする。',
        },
        supportsOutcomes: ['SWE.6.3'],
        outputs: [{ itemId: '13-04' }],
        inputs: [{ itemId: '14-07' }, { itemId: '11-07' }],
      },
      {
        id: 'SWE.6.BP4',
        name: { en: 'Establish traceability', ja: 'トレーサビリティを確立する' },
        description: {
          en: 'Establish bilateral traceability between the software qualification test specification and the software requirements.',
          ja: 'ソフトウェア適格性確認テスト仕様とソフトウェア要件の間で双方向トレーサビリティを確立する。',
        },
        supportsOutcomes: ['SWE.6.4'],
        outputs: [{ itemId: '15-01' }],
        inputs: [{ itemId: '17-08' }],
      },
      {
        id: 'SWE.6.BP5',
        name: { en: 'Record software qualification test results', ja: 'ソフトウェア適格性確認テスト結果を記録する' },
        description: {
          en: 'Record the software qualification test results including pass/fail status.',
          ja: 'パス/フェイルのステータスを含むソフトウェア適格性確認テスト結果を記録する。',
        },
        supportsOutcomes: ['SWE.6.5'],
        outputs: [{ itemId: '13-04' }],
        inputs: [],
      },
    ],
    outputItems: [
      {
        id: '11-07',
        name: { en: 'Software Qualification Test Specification', ja: 'ソフトウェア適格性確認テスト仕様' },
        characteristics: [
          { en: 'Test cases based on software requirements', ja: 'ソフトウェア要件に基づくテストケース' },
          { en: 'Regression test strategy', ja: 'リグレッションテスト戦略' },
        ],
      },
    ],
  },
]
