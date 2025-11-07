import { useState, useMemo, useCallback, useEffect } from 'react';
import { View, ScrollView, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Pill, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { medicationServiceMock } from '@/mocks/medication-service-mock';
import { MedicationHistory } from '@/types/medication';
import {
  format,
  isSameDay,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  getDay,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

// --- INTERNAL SCREEN TYPES ---
interface DailyHistoryUI {
  takenCount: number;
  missedCount: number;
  postponedCount: number;
  details: {
    id: string;
    name: string;
    dosage: string;
    time: string;
    status: 'taken' | 'missed' | 'postponed';
  }[];
}

// --- HELPER COMPONENTS ---

interface AdherenceCardProps {
  title: string;
  count: number;
  color: string;
}

const AdherenceCard = ({ title, count, color }: AdherenceCardProps) => (
  <View className="mx-2 flex-1 rounded-lg border border-border bg-card p-4 dark:border-border-dark dark:bg-card-dark">
    <Text className="mb-1 text-sm font-medium text-foreground dark:text-foreground-dark">
      {title}
    </Text>
    <Text className="text-3xl font-bold text-foreground dark:text-foreground-dark">{count}</Text>
  </View>
);

interface HistoryTimelineItemProps {
  item: DailyHistoryUI['details'][0];
  isLast: boolean;
  colors: ReturnType<typeof useThemeColors>;
}

const HistoryTimelineItem = ({ item, isLast, colors }: HistoryTimelineItemProps) => {
  let statusText: string;
  let statusTextColor: string;

  const iconComponent = <Pill size={16} color={colors.textPrimary} />;

  switch (item.status) {
    case 'taken':
      statusText = `Tomado às ${item.time}`;
      break;
    case 'missed':
      statusText = 'Esquecido';
      break;
    case 'postponed':
      statusText = 'Adiado';
      break;
  }

  return (
    <View className="flex-row">
      {/* Timeline Point */}
      <View className="mr-4 items-center pt-1">
        {iconComponent}
        {/* Connector Line */}
        {!isLast && (
          <View
            className="w-[1px] flex-1 bg-muted-foreground/50 dark:bg-muted-foreground-dark/50"
            style={{ height: '100%' }}
          />
        )}
      </View>

      <View className="flex-1 pb-6">
        <Text className="text-base font-semibold text-foreground dark:text-foreground-dark">
          {item.name} {item.dosage}
        </Text>
        <Text className="mt-0.5 text-sm font-medium text-muted-foreground dark:text-muted-foreground-dark">
          {statusText}
        </Text>
      </View>
    </View>
  );
};

// --- DATA LOGIC FUNCTIONS ---
const processHistoryData = (rawHistory: MedicationHistory[]): DailyHistoryUI => {
  let takenCount = 0;
  let missedCount = 0;
  let postponedCount = 0;

  const details = rawHistory
    .map((item) => {
      const scheduledDate = new Date(item.scheduledTime);

      if (item.status === 'confirmed') {
        takenCount++;
      } else if (item.status === 'missed') {
        missedCount++;
      } else if (item.status === 'postponed') {
        postponedCount++;
      }

      const uiStatus: 'taken' | 'missed' | 'postponed' =
        item.status === 'confirmed' ? 'taken' : item.status === 'missed' ? 'missed' : 'postponed';

      return {
        id: item.id,
        name: item.medicationName,
        dosage: item.dosage,
        time: format(scheduledDate, 'HH:mm'),
        status: uiStatus,
        sortKey: scheduledDate.getTime(),
      };
    })
    .sort((a, b) => a.sortKey - b.sortKey);

  return { takenCount, missedCount, postponedCount, details };
};

// --- UTILITY FUNCTION ---
const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// --- CALENDAR COMPONENT ---

interface CalendarGridProps {
  currentMonth: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
  colors: ReturnType<typeof useThemeColors>;
}

const WEEK_DAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const CalendarGrid = ({
  currentMonth,
  selectedDate,
  onDateSelect,
  onMonthChange,
  colors,
}: CalendarGridProps) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Domingo
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 }); // Sábado

  const days: Date[] = [];
  let day = startDate;

  while (day <= endDate && days.length < 42) {
    days.push(day);
    day = addDays(day, 1);
  }

  const handlePrevMonth = () => onMonthChange(subMonths(currentMonth, 1));
  const handleNextMonth = () => onMonthChange(addMonths(currentMonth, 1));

  const monthTitle = capitalizeFirstLetter(format(currentMonth, 'MMM yyyy', { locale: ptBR }));

  return (
    <View className="px-6 py-4">
      {/* Month Navigation */}
      <View className="mb-6 flex-row items-center justify-between">
        <Pressable onPress={handlePrevMonth} className="p-2">
          <ChevronLeft size={24} color={colors.textPrimary} strokeWidth={1.5} />
        </Pressable>
        <Text className="text-lg font-bold text-foreground dark:text-foreground-dark">
          {monthTitle}
        </Text>
        <Pressable onPress={handleNextMonth} className="p-2">
          <ChevronRight size={24} color={colors.textPrimary} strokeWidth={1.5} />
        </Pressable>
      </View>

      {/* Week Header */}
      <View className="mb-2 flex-row justify-around">
        {WEEK_DAYS.map((dayName, index) => (
          <Text
            key={index}
            className="w-[14.28%] text-center text-sm font-semibold text-foreground/70 dark:text-foreground-dark/70">
            {dayName}
          </Text>
        ))}
      </View>

      {/* Day Grid (6 rows x 7 columns) */}
      <View className="flex-row flex-wrap justify-around">
        {days.map((date, index) => {
          const dayOfMonth = format(date, 'd');
          const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
          const isToday = isSameDay(date, new Date());
          const isSelected = isSameDay(date, selectedDate);

          const backgroundColor = isSelected
            ? colors.primary
            : isCurrentMonth
              ? colors.card
              : 'transparent';

          const textColor = isSelected ? colors.primaryForeground : colors.textPrimary;

          return (
            <View key={date.toISOString()} className="h-12 w-[14.28%] items-center justify-center">
              <Pressable
                onPress={() => onDateSelect(date)}
                className={`h-12 w-12 items-center justify-center rounded-full`}
                style={{
                  backgroundColor: backgroundColor,
                  opacity: isCurrentMonth ? 1 : 0.4,
                }}>
                <Text
                  className={`text-base font-semibold`}
                  style={{
                    color: textColor,
                  }}>
                  {dayOfMonth}
                </Text>
                {/* "Today" indicator */}
                {isToday && !isSelected && (
                  <View
                    className="absolute bottom-1 h-1 w-1 rounded-full"
                    style={{ backgroundColor: colors.primary }}
                  />
                )}
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default function HistoryScreen() {
  const colors = useThemeColors();
  const today = useMemo(() => startOfDay(new Date()), []);

  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [currentMonth, setCurrentMonth] = useState(today); // State for the viewed month

  const [dailyHistory, setDailyHistory] = useState<DailyHistoryUI | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ----------------------------------------------------------------------
  // 1. DATA FETCHING (Simulating API)
  // ----------------------------------------------------------------------

  const fetchHistoryForDay = useCallback(async (date: Date) => {
    setIsLoading(true);
    setError(null);
    setDailyHistory(null);

    // The mock service filters by date.
    try {
      const startDate = startOfDay(date).toISOString();
      const endDate = endOfDay(date).toISOString();

      const rawData = await medicationServiceMock.getMedicationHistory(startDate, endDate);

      // Process raw data for the UI
      const processedData = processHistoryData(rawData);
      setDailyHistory(processedData);
    } catch (err) {
      console.error('[MOCK API] Erro ao carregar histórico:', err);
      setError('Não foi possível carregar o histórico. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isSameDay(startOfMonth(selectedDate), startOfMonth(currentMonth))) {
      setCurrentMonth(startOfMonth(selectedDate));
    }
    fetchHistoryForDay(selectedDate);
  }, [selectedDate, fetchHistoryForDay]);

  // ----------------------------------------------------------------------
  // 2. CALENDAR LOGIC
  // ----------------------------------------------------------------------

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const handleMonthChange = useCallback((date: Date) => {
    setCurrentMonth(date);
  }, []);

  // ----------------------------------------------------------------------
  // 3. RENDER
  // ----------------------------------------------------------------------

  if (isLoading && !dailyHistory) {
    return (
      <View className="flex-1 items-center justify-center bg-background pt-20 dark:bg-background-dark">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="mt-4 text-muted-foreground dark:text-muted-foreground-dark">
          Carregando histórico...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <View className="relative items-center justify-center px-6 pb-4 pt-12">
        <Text className="text-lg font-bold text-foreground dark:text-foreground-dark">
          Histórico
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        {/* Calendar Component */}
        <CalendarGrid
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          onMonthChange={handleMonthChange}
          colors={colors}
        />

        {/* Adherence Title */}
        <Text className="mb-4 mt-2 px-6 text-xl font-bold text-foreground dark:text-foreground-dark">
          Adesão
        </Text>

        {/* Adherence Area (Metrics) */}
        {dailyHistory && (
          <View className="mb-8 flex-row justify-between px-4">
            <AdherenceCard
              title="Doses Tomadas"
              count={dailyHistory.takenCount}
              color={colors.success}
            />
            <AdherenceCard
              title="Doses Esquecidas"
              count={dailyHistory.missedCount + dailyHistory.postponedCount}
              color={colors.error}
            />
          </View>
        )}

        {/* Details Title */}
        <View className="px-6">
          <Text className="mb-4 text-xl font-bold text-foreground dark:text-foreground-dark">
            Detalhes
          </Text>

          {dailyHistory && dailyHistory.details.length === 0 ? (
            <View className="items-center py-10">
              <Text className="text-center text-muted-foreground dark:text-muted-foreground-dark">
                Nenhum medicamento registrado para o dia {format(selectedDate, 'dd/MM/yyyy')}.
              </Text>
            </View>
          ) : (
            <View className="pl-2">
              {dailyHistory?.details.map((item, index) => (
                <HistoryTimelineItem
                  key={item.id}
                  item={item}
                  isLast={index === dailyHistory.details.length - 1}
                  colors={colors}
                />
              ))}
            </View>
          )}
        </View>

        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
