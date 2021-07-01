from odmantic import EmbeddedModel


class MaxPacksMultiplier(EmbeddedModel):
    title: str = ('Число, которое умножается на кол-во паллет после пинцета'
                  'для вычисления максимума возможных пачек')
    desc: str = 'Введите число'
    value: int = 8
    value_type: str = 'integer'


class MaxPacksOnAssemblyMultiplier(EmbeddedModel):
    title: str = ('Число, которое умножается на кол-во паллет после пинцета'
                  'для вычисления максимума возможных пачек на сборке')
    desc: str = 'Введите число'
    value: int = 7
    value_type: str = 'integer'


class MaxMultipacksExitedPintsetMultiplier(EmbeddedModel):
    title: str = (
        'Число, которое умножается на кол-во паллет после пинцета'
        'для вычисления максимума возможных паллет, вышедших из пинцета')
    desc: str = 'Введите число'
    value: int = 2
    value_type: str = 'integer'


class MaxWrappingMultipacks(EmbeddedModel):
    title: str = 'Максимальное число паллет в обмотке'
    desc: str = 'Введите число'
    value: int = 1
    value_type: str = 'integer'


class MaxMultipacksEnteredPitchforkMultiplier(EmbeddedModel):
    title: str = (
        'Число, которое умножается на кол-во паллет после пинцета'
        'для вычисления максимума возможных паллет, заехавших на виллы')
    desc: str = 'Введите число'
    value: int = 2
    value_type: str = 'integer'


class MaxMultipacksOnPackingTableMultiplier(EmbeddedModel):
    title: str = (
        'Число, которое умножается на кол-во паллет после пинцета'
        'для вычисления максимума возможных паллет на упаковочном столе')
    desc: str = 'Введите число'
    value: int = 4
    value_type: str = 'integer'


class DesyncConstantSettings(EmbeddedModel):
    title: str = 'Настройки констант рассинхрона'
    advanced: bool = True
    max_packs_multiplier: MaxPacksMultiplier = MaxPacksMultiplier()
    max_packs_on_assembly_multiplier: MaxPacksOnAssemblyMultiplier = MaxPacksOnAssemblyMultiplier(
    )
    max_multipacks_exited_pintset_multiplier: MaxMultipacksExitedPintsetMultiplier = MaxMultipacksExitedPintsetMultiplier(
    )
    max_wrapping_multipacks: MaxWrappingMultipacks = MaxWrappingMultipacks()
    max_multipacks_entered_pitchfork_multiplier: MaxMultipacksEnteredPitchforkMultiplier = MaxMultipacksEnteredPitchforkMultiplier(
    )
    max_multipacks_on_packing_table_multiplier: MaxMultipacksOnPackingTableMultiplier = MaxMultipacksOnPackingTableMultiplier()
