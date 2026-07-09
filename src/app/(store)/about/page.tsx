"use client";

import { motion } from "framer-motion";
import { Heart, Shield, Award, Users, MapPin, Clock } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "صحتك أولويتنا",
      description: "نحرص على تقديم أفضل المنتجات الصحية والدوائية لعملائنا",
      color: "bg-red-50 text-red-600",
    },
    {
      icon: Shield,
      title: "منتجات أصلية",
      description: "جميع منتجاتنا أصلية ومضمونة من مصادر موثوقة",
      color: "bg-brand-purple-50 text-brand-purple-600",
    },
    {
      icon: Award,
      title: "خبرة وكفاءة",
      description: "فريق صيدلاني متخصص لخدمتكم والإجابة على استفساراتكم",
      color: "bg-brand-purple-50 text-brand-purple-500",
    },
    {
      icon: Users,
      title: "خدمة عملاء متميزة",
      description: "نسعى دائماً لتقديم أفضل تجربة تسوق لعملائنا",
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          عن صيدلية <span className="text-brand-purple-600">سما السكر</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          صيدلية سما السكر في الموصل - وجهتكم الأولى للمنتجات الصيدلانية والعناية
          الصحية. نقدم لكم تشكيلة واسعة من الأدوية والمكملات الغذائية ومستحضرات
          التجميل بأسعار منافسة وجودة عالية.
        </p>
      </motion.div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {values.map((value, index) => (
          <motion.div
            key={value.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
          >
            <div
              className={`w-12 h-12 rounded-xl ${value.color} flex items-center justify-center mb-4`}
            >
              <value.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {value.title}
            </h3>
            <p className="text-gray-600">{value.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-brand-purple-50 rounded-2xl p-6 border border-brand-purple-100"
        >
          <div className="flex items-center gap-3 mb-3">
            <MapPin className="w-5 h-5 text-brand-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">موقعنا</h3>
          </div>
          <p className="text-gray-700">الموصل، نينوى، العراق</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-brand-purple-50 rounded-2xl p-6 border border-brand-purple-100"
        >
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-5 h-5 text-brand-purple-500" />
            <h3 className="text-lg font-bold text-gray-900">ساعات العمل</h3>
          </div>
          <p className="text-gray-700">السبت - الخميس: 9 صباحاً - 10 مساءً</p>
          <p className="text-gray-700">الجمعة: 2 ظهراً - 10 مساءً</p>
        </motion.div>
      </div>
    </div>
  );
}
