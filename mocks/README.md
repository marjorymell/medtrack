# 🎭 Mocks - Simulação de API Backend

Esta pasta contém a implementação de **mocks** (dados simulados) para desenvolvimento frontend sem depender do backend real.

## 📁 Estrutura de Arquivos

```
lib/mocks/
├── README.md                    # Este arquivo
├── medication-data.ts           # Dados mockados (medicamentos, histórico, estoque)
├── medication-service-mock.ts   # Serviço que simula chamadas de API
└── utils.ts                     # Utilitários (delays, IDs, etc)
```

---

## 🚀 Como Usar os Mocks

### 1. Importar o Serviço Mock

```typescript
import { medicationServiceMock } from '@/lib/mocks/medication-service-mock';

// Exemplo de uso
async function loadMedications() {
  try {
    const medications = await medicationServiceMock.getTodayMedications();
    console.log('Medicamentos:', medications);
  } catch (error) {
    console.error('Erro:', error);
  }
}
```

### 2. Métodos Disponíveis

#### `getTodayMedications()`
Retorna lista de medicamentos programados para hoje.

```typescript
const medications = await medicationServiceMock.getTodayMedications();
// Retorna: TodayMedication[]
```

#### `confirmMedication(scheduleId)`
Confirma que uma dose foi tomada.

```typescript
const result = await medicationServiceMock.confirmMedication('schedule-1');
// Retorna: ApiResponse<void>
// Efeito colateral: decrementa estoque automaticamente
```

#### `postponeMedication(scheduleId, minutes?)`
Adia uma dose para mais tarde (padrão: 30 minutos).

```typescript
const result = await medicationServiceMock.postponeMedication('schedule-1', 60);
// Retorna: ApiResponse<void>
```

#### `getMedicationHistory(startDate?, endDate?)`
Busca histórico de medicamentos (com filtro opcional por data).

```typescript
const history = await medicationServiceMock.getMedicationHistory();
// Retorna: MedicationHistory[]
```

#### `getMedicationStock()`
Busca estoque atual de medicamentos.

```typescript
const stock = await medicationServiceMock.getMedicationStock();
// Retorna: MedicationStock[]
```

#### `getAdherenceRate(days?)`
Calcula taxa de adesão ao tratamento (padrão: últimos 7 dias).

```typescript
const rate = await medicationServiceMock.getAdherenceRate(7);
// Retorna: number (0-100)
```

#### `resetMockData()`
Reseta os dados para o estado inicial (útil para testes).

```typescript
medicationServiceMock.resetMockData();
```

---

## 🔄 Alternando Entre Mock e API Real

### Opção 1: Variável de Ambiente (Recomendado)

**1. Adicione no `.env`:**
```env
EXPO_PUBLIC_USE_MOCK_API=true
```

**2. Crie um wrapper de serviço:**

`lib/services/medication-service.ts`:
```typescript
import { medicationServiceMock } from '@/lib/mocks/medication-service-mock';
import { medicationServiceReal } from '@/lib/services/medication-service-real';

const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK_API === 'true';

export const medicationService = USE_MOCK 
  ? medicationServiceMock 
  : medicationServiceReal;
```

**3. Use no código:**
```typescript
import { medicationService } from '@/lib/services/medication-service';

// Funciona com mock OU API real, dependendo da variável de ambiente
const medications = await medicationService.getTodayMedications();
```

### Opção 2: Importação Direta

**Durante desenvolvimento (com mock):**
```typescript
import { medicationServiceMock as medicationService } from '@/lib/mocks/medication-service-mock';
```

**Em produção (com API real):**
```typescript
import { medicationServiceReal as medicationService } from '@/lib/services/medication-service-real';
```

---

## 🎯 Características dos Mocks

### ✅ O que os mocks simulam:

1. **Latência de rede**: Delays aleatórios de 500-1500ms
2. **Estado persistente**: Mudanças ficam salvas durante a sessão
3. **Regras de negócio**:
   - Decremento automático de estoque ao confirmar (RN02)
   - Ordenação por horário
   - Cálculo de taxa de adesão
4. **Logs no console**: Todas as operações são logadas
5. **Estrutura de resposta**: Igual à API real

### ❌ O que os mocks NÃO fazem:

- Persistência entre sessões (dados resetam ao recarregar)
- Validação de autenticação JWT
- Erros de rede aleatórios (comentado, mas pode ser habilitado)
- Paginação
- Rate limiting

---

## 📊 Dados Mockados Disponíveis

### Medicamentos de Hoje
- 5 medicamentos com horários variados (07:30 - 20:00)
- Paracetamol, Ibuprofeno, Amoxicilina, Omeprazol, Losartana

### Histórico
- 3 registros dos últimos 2 dias
- Statuses: confirmed, missed

### Estoque
- 5 medicamentos com quantidades variadas
- Alguns abaixo do estoque mínimo (para testar alertas)
- Datas de validade futuras

---

## 🛠️ Modificando os Dados Mockados

### Adicionar Novos Medicamentos

Edite `medication-data.ts`:

```typescript
export const MOCK_TODAY_MEDICATIONS: TodayMedication[] = [
  // ... medicamentos existentes
  {
    id: '6',
    scheduleId: 'schedule-6',
    name: 'Aspirina',
    dosage: '100mg',
    time: '09:00',
    scheduledTime: new Date().setHours(9, 0, 0, 0).toString(),
    status: 'pending',
    taken: false,
    postponed: false,
    userId: 'user-1',
  },
];
```

### Alterar Comportamento

Edite `medication-service-mock.ts`:

```typescript
// Exemplo: mudar delay padrão
await simulateNetworkDelay(200); // Delay fixo de 200ms

// Exemplo: simular erro
if (Math.random() < 0.2) { // 20% de chance de erro
  throw new Error('Erro simulado de rede');
}
```

---

## 🧪 Testando com Mocks

### Exemplo de Teste de Fluxo

```typescript
import { medicationServiceMock } from '@/lib/mocks/medication-service-mock';

async function testMedicationFlow() {
  // 1. Resetar dados
  medicationServiceMock.resetMockData();
  
  // 2. Buscar medicamentos
  const meds = await medicationServiceMock.getTodayMedications();
  console.log('Total:', meds.length);
  
  // 3. Confirmar primeiro medicamento
  const firstMed = meds[0];
  await medicationServiceMock.confirmMedication(firstMed.scheduleId);
  
  // 4. Verificar histórico
  const history = await medicationServiceMock.getMedicationHistory();
  console.log('Histórico:', history);
  
  // 5. Verificar estoque
  const stock = await medicationServiceMock.getMedicationStock();
  console.log('Estoque:', stock);
  
  // 6. Calcular adesão
  const adherence = await medicationServiceMock.getAdherenceRate();
  console.log('Taxa de adesão:', adherence + '%');
}
```

---

## 📝 Notas Importantes

1. **Estado em memória**: Os dados mockados são mantidos em memória durante a execução. Ao recarregar o app, tudo volta ao estado inicial.

2. **Logs detalhados**: Todas as operações são logadas no console com o prefixo `[MOCK API]` para facilitar debugging.

3. **Sincronização automática**: Quando você confirma um medicamento, o estoque é automaticamente decrementado (simulando a regra RN02 do backend).

4. **Ordenação**: Os medicamentos são sempre retornados ordenados por horário.

5. **Singleton**: O `medicationServiceMock` é uma instância única compartilhada. Mudanças afetam todas as partes do app.

---

## 🔜 Migração para API Real

Quando o backend estiver pronto:

1. **Crie o serviço real** em `lib/services/medication-service-real.ts`
2. **Use a mesma interface** dos métodos mockados
3. **Configure variável de ambiente** para alternar
4. **Teste gradualmente** trocando rota por rota

**Não delete os mocks!** Eles continuam úteis para:
- Desenvolvimento offline
- Testes automatizados
- Demonstrações
- Onboarding de novos desenvolvedores

---

## 🐛 Debugging

Para ver todas as operações sendo executadas:

```typescript
// Os logs aparecem automaticamente no console
// Exemplo de saída:
// [MOCK API] Buscando medicamentos de hoje...
// [MOCK API] ✓ Retornando 5 medicamentos
// [MOCK API] Confirmando medicamento: schedule-1
// [MOCK API] Estoque decrementado: Paracetamol restam 14
// [MOCK API] ✓ Medicamento confirmado com sucesso
```

---

**Última atualização**: Outubro 2025  
**Versão**: 1.0.0  
**Compatibilidade**: Backend API v1
