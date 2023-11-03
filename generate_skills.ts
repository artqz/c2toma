import math from "mathjs"
// Задаем ваши данные
const x = [1, 10, 20, 30, 40, 50];
const y = [0.46, 0.59, 0.80, 1.07, 1.44, 1.94];

// Функция для аппроксимации данных полиномом
function polyfit(x: number[], y: number[], degree: number) {
  const n = x.length;
  if (n !== y.length) {
    throw new Error('Массивы x и y должны иметь одинаковую длину');
  }

  const powers = Array.from({ length: degree + 1 }, (_, i) => i);
  const terms = powers.map(power => x.map(xi => Math.pow(xi, power)));
  const xMatrix = math.transpose(terms);
  const yMatrix = math.matrix(y);

  const coefficients = math.multiply(
    math.multiply(
      math.inv(math.multiply(math.transpose(xMatrix), xMatrix)),
      math.transpose(xMatrix)
    ),
    yMatrix
  ).toArray();

  return coefficients;
}

/// Аппроксимация полиномом 2-й степени
const degree = 2;
const coefficients: Record<any, any> = polyfit(x, y, degree);

// Создаем функцию для вычисления Y по X
function predictY(xValue: any) {
  let result = 0;
  for (let i = 0; i <= degree; i++) {
    result += coefficients[i] * Math.pow(xValue, i);
  }
  return result;
}

// Пример использования
const xValueToPredict = 15; // Значение X, для которого мы хотим предсказать Y
const predictedY = predictY(xValueToPredict);
console.log(`Для x = ${xValueToPredict}, y ≈ ${predictedY}`);